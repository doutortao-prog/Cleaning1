
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase com as chaves fornecidas
const firebaseConfig = {
  apiKey: "AIzaSyAL-cnHD117r9wy5LZXTKmhWAGEtlyuuPc",
  authDomain: "cleanmaster-app.firebaseapp.com",
  projectId: "cleanmaster-app",
  storageBucket: "cleanmaster-app.firebasestorage.app",
  messagingSenderId: "329693909904",
  appId: "1:329693909904:web:e3a2e87ca23e237a2f9915",
  measurementId: "G-L9J3D2KQS8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
