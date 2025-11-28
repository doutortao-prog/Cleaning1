
import { Brand, CatalogFile, VideoResource } from '../types';
import { db, storage } from './firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";

// --- CATALOGS (PDFs) ---

export const saveCatalog = async (brand: Brand, file: File): Promise<boolean> => {
  try {
    // 1. Upload Arquivo para Storage
    const storageRef = ref(storage, `catalogs/${brand}.pdf`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    // 2. Salvar Metadados no Firestore
    const catalogData: CatalogFile = {
      name: file.name,
      url: url,
      type: file.type,
      uploadDate: new Date().toISOString()
    };

    await setDoc(doc(db, "catalogs", brand), catalogData);
    return true;
  } catch (e) {
    console.error("Firebase Storage/DB Error", e);
    return false;
  }
};

export const getCatalog = async (brand: Brand): Promise<CatalogFile | null> => {
  try {
    const docRef = doc(db, "catalogs", brand);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as CatalogFile;
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error getting catalog", e);
    return null;
  }
};

export const removeCatalog = async (brand: Brand): Promise<void> => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, "catalogs", brand));
    // Delete from Storage
    const storageRef = ref(storage, `catalogs/${brand}.pdf`);
    await deleteObject(storageRef);
  } catch (e) {
    console.error("Error removing catalog", e);
  }
};

// --- VIDEOS ---

export const saveVideo = async (video: VideoResource, file?: File): Promise<boolean> => {
  try {
    let finalUrl = video.data;

    // Se for arquivo, faz upload primeiro
    if (video.type === 'file' && file) {
      const storageRef = ref(storage, `videos/${video.id}_${file.name}`);
      await uploadBytes(storageRef, file);
      finalUrl = await getDownloadURL(storageRef);
    }

    const videoData: VideoResource = {
        ...video,
        data: finalUrl
    };

    await setDoc(doc(db, "videos", video.id), videoData);
    return true;
  } catch (e) {
    console.error("Erro ao salvar vídeo", e);
    return false;
  }
};

export const getVideos = async (brand?: Brand): Promise<VideoResource[]> => {
  try {
    const videosRef = collection(db, "videos");
    let q = query(videosRef);
    
    // Filtro Opcional
    // if (brand) q = query(videosRef, where("brand", "==", brand)); 
    // Nota: Filtraremos no cliente para simplificar indices no inicio

    const querySnapshot = await getDocs(q);
    const videos: VideoResource[] = [];
    
    querySnapshot.forEach((doc) => {
      videos.push(doc.data() as VideoResource);
    });

    if (brand) {
        return videos.filter(v => v.brand === brand);
    }
    return videos;
  } catch (e) {
    console.error("Erro ao buscar vídeos", e);
    return [];
  }
};

export const deleteVideo = async (id: string, type: 'file' | 'link'): Promise<void> => {
  try {
    // 1. Pega dados para saber nome do arquivo se for file (opcional, ou tenta deletar direto)
    // Simplificação: Deleta doc do firestore
    await deleteDoc(doc(db, "videos", id));
    
    // Se quiser deletar o arquivo do storage, precisaria guardar o 'path' do storage no objeto video.
    // Por enquanto deletamos a referência no banco.
  } catch (e) {
    console.error("Erro ao deletar vídeo", e);
  }
};