
import { Brand, CatalogFile } from '../types';

const CATALOG_PREFIX = 'cleanmaster_catalog_';

export const saveCatalog = async (brand: Brand, file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const base64Data = reader.result as string;
        const catalogData: CatalogFile = {
          name: file.name,
          data: base64Data,
          type: file.type,
          uploadDate: new Date().toISOString()
        };
        
        // LocalStorage tem limite (geralmente 5MB). PDFs grandes podem falhar aqui.
        localStorage.setItem(`${CATALOG_PREFIX}${brand}`, JSON.stringify(catalogData));
        resolve(true);
      } catch (e) {
        console.error("Erro ao salvar catálogo. Provavelmente excedeu o limite do LocalStorage.", e);
        alert("Erro: O arquivo é muito grande para o armazenamento local do navegador. Tente um PDF menor (max ~4MB).");
        resolve(false);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsDataURL(file);
  });
};

export const getCatalog = (brand: Brand): CatalogFile | null => {
  try {
    const data = localStorage.getItem(`${CATALOG_PREFIX}${brand}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const removeCatalog = (brand: Brand) => {
  localStorage.removeItem(`${CATALOG_PREFIX}${brand}`);
};
