import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// IMPORTANTE: Substitua estes valores pelos do seu Console Firebase
// Se estiver usando Vercel, configure estas chaves nas Environment Variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "SUA_API_KEY_AQUI",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "seu-projeto.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "seu-projeto",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "seu-projeto.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "00000000000",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:00000000:web:0000000000"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);