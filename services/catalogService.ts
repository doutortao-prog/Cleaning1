
import { Brand, CatalogFile } from '../types';

const DB_NAME = 'CleanMasterDB';
const DB_VERSION = 1;
const STORE_NAME = 'catalogs';

// Utilitário para abrir o banco de dados
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Verifica suporte
    if (!('indexedDB' in window)) {
        reject('IndexedDB not supported');
        return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const saveCatalog = async (brand: Brand, file: File): Promise<boolean> => {
  try {
    const db = await openDB();
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onload = () => {
        const base64Data = reader.result as string;
        const catalogData: CatalogFile = {
          name: file.name,
          data: base64Data,
          type: file.type,
          uploadDate: new Date().toISOString()
        };

        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(catalogData, brand);

        request.onsuccess = () => resolve(true);
        request.onerror = (e) => {
            console.error("Erro ao salvar no IndexedDB", e);
            resolve(false);
        };
      };
      reader.onerror = () => resolve(false);
      reader.readAsDataURL(file);
    });
  } catch (e) {
    console.error("IndexedDB Error", e);
    return false;
  }
};

export const getCatalog = async (brand: Brand): Promise<CatalogFile | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(brand);

      request.onsuccess = () => {
        resolve(request.result as CatalogFile || null);
      };
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    console.error("Erro ao ler do IndexedDB", e);
    return null;
  }
};

export const removeCatalog = async (brand: Brand): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(brand);
  } catch (e) {
    console.error("Erro ao remover do IndexedDB", e);
  }
};
