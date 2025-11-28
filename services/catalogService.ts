
import { Brand, CatalogFile, VideoResource } from '../types';

const DB_NAME = 'CleanMasterDB';
const DB_VERSION = 2; // Incrementado para adicionar store de vídeos
const STORE_CATALOGS = 'catalogs';
const STORE_VIDEOS = 'videos';

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
      
      // Store de Catálogos (PDFs)
      if (!db.objectStoreNames.contains(STORE_CATALOGS)) {
        db.createObjectStore(STORE_CATALOGS);
      }

      // Store de Vídeos
      if (!db.objectStoreNames.contains(STORE_VIDEOS)) {
        db.createObjectStore(STORE_VIDEOS, { keyPath: 'id' });
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

// --- CATALOGS (PDFs) ---

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

        const transaction = db.transaction(STORE_CATALOGS, 'readwrite');
        const store = transaction.objectStore(STORE_CATALOGS);
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
      const transaction = db.transaction(STORE_CATALOGS, 'readonly');
      const store = transaction.objectStore(STORE_CATALOGS);
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
    const transaction = db.transaction(STORE_CATALOGS, 'readwrite');
    const store = transaction.objectStore(STORE_CATALOGS);
    store.delete(brand);
  } catch (e) {
    console.error("Erro ao remover do IndexedDB", e);
  }
};

// --- VIDEOS ---

export const saveVideo = async (video: VideoResource): Promise<boolean> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_VIDEOS, 'readwrite');
    const store = transaction.objectStore(STORE_VIDEOS);
    const request = store.put(video);

    return new Promise((resolve) => {
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (e) {
    console.error("Erro ao salvar vídeo", e);
    return false;
  }
};

export const getVideos = async (brand?: Brand): Promise<VideoResource[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_VIDEOS, 'readonly');
      const store = transaction.objectStore(STORE_VIDEOS);
      const request = store.getAll();

      request.onsuccess = () => {
        const allVideos = request.result as VideoResource[];
        if (brand) {
          resolve(allVideos.filter(v => v.brand === brand));
        } else {
          resolve(allVideos);
        }
      };
      request.onerror = () => resolve([]);
    });
  } catch (e) {
    console.error("Erro ao buscar vídeos", e);
    return [];
  }
};

export const deleteVideo = async (id: string): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_VIDEOS, 'readwrite');
    const store = transaction.objectStore(STORE_VIDEOS);
    store.delete(id);
  } catch (e) {
    console.error("Erro ao deletar vídeo", e);
  }
};
