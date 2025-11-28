
import { User } from '../types';
import { auth, db } from './firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs,
  query,
  where
} from "firebase/firestore";

const SESSION_KEY = 'cleanmaster_user_session';

export const registerUser = async (userData: Omit<User, 'role' | 'joinedAt' | 'lastLogin' | 'approved'>, password: string): Promise<boolean> => {
  try {
    // 1. Criar Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const user = userCredential.user;

    // 2. Salvar dados extras no Firestore
    const newUser: User = {
      uid: user.uid,
      ...userData,
      role: 'user', // Padrão é user
      approved: false, // Padrão é NÃO aprovado até admin liberar
      joinedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await setDoc(doc(db, "users", user.uid), newUser);
    
    // Auto logout após registro para esperar aprovação
    await signOut(auth);
    
    return true;
  } catch (error) {
    console.error("Firebase Registration failed", error);
    return false;
  }
};

export const loginUser = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    // Login Hardcoded Admin (Backdoor para primeiro acesso se necessário, ideal remover em prod)
    if (email === 'admin' && password === 'admin123') {
        const adminUser: User = {
            name: 'Super Admin',
            phone: '',
            email: 'admin@cleanmaster.com',
            company: 'CleanMaster',
            role: 'admin',
            approved: true,
            joinedAt: new Date().toISOString()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Buscar dados do Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      
      // Validação de Aprovação
      if (userData.role !== 'admin' && !userData.approved) {
        await signOut(auth);
        return { success: false, error: "Sua conta aguarda aprovação do administrador." };
      }

      // Atualizar last login
      await updateDoc(doc(db, "users", firebaseUser.uid), {
        lastLogin: new Date().toISOString()
      });

      // Salva na sessão local para persistência rápida
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      
      return { success: true, user: userData };
    } else {
      return { success: false, error: "Dados do usuário não encontrados no sistema." };
    }
  } catch (error: any) {
    console.error("Login error", error);
    return { success: false, error: "Email ou senha incorretos." };
  }
};

export const logoutUser = async () => {
  await signOut(auth);
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(SESSION_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// --- ADMIN FUNCTIONS ---

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as User);
    });
    // Ordenar: Pendentes primeiro, depois data
    return users.sort((a, b) => {
        if (a.approved === b.approved) {
            return new Date(b.joinedAt || '').getTime() - new Date(a.joinedAt || '').getTime();
        }
        return a.approved ? 1 : -1;
    });
  } catch (error) {
    console.error("Error fetching users", error);
    return [];
  }
};

export const approveUser = async (uid: string): Promise<boolean> => {
    try {
        await updateDoc(doc(db, "users", uid), {
            approved: true
        });
        return true;
    } catch (error) {
        console.error("Error approving user", error);
        return false;
    }
};

export const deleteUserDb = async (uid: string): Promise<void> => {
    // Nota: Firebase Client SDK não deleta Auth User, apenas o doc do Firestore
    // Para deletar Auth User precisaria de Cloud Functions
    // Aqui vamos apenas desativar/remover do banco visual
    await updateDoc(doc(db, "users", uid), {
        approved: false,
        role: 'banned'
    });
};