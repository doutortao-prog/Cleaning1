
import { User } from '../types';

const SESSION_KEY = 'cleanmaster_user_session';
const TOKEN_KEY = 'cleanmaster_auth_token';
const DB_USERS_KEY = 'cleanmaster_users_db'; // "Banco de dados" de usuários

// Inicializa o banco de dados se vazio
const initDB = () => {
  if (!localStorage.getItem(DB_USERS_KEY)) {
    localStorage.setItem(DB_USERS_KEY, JSON.stringify([]));
  }
};

export const registerUser = (userData: Omit<User, 'role' | 'joinedAt' | 'lastLogin'>, password: string): boolean => {
  initDB();
  try {
    const newUser: User = {
      ...userData,
      role: 'user',
      joinedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Salva na "tabela" de usuários
    const usersDb = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
    // Verifica duplicidade simples por email
    if (usersDb.some((u: User) => u.email === newUser.email)) {
        return false;
    }
    usersDb.push(newUser);
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(usersDb));

    // Loga o usuário automaticamente
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_KEY, 'mock-token-' + Date.now());
    return true;
  } catch (error) {
    console.error("Registration failed", error);
    return false;
  }
};

export const loginUser = (email: string, password: string): User | null => {
  initDB();
  try {
    const now = new Date().toISOString();

    // 1. ADMIN HARDCODED
    if (email === 'admin' && password === 'admin123') {
      const adminUser: User = {
        name: 'Administrador',
        phone: '0000000000',
        email: 'admin@cleanmaster.com',
        company: 'CleanMaster HQ',
        role: 'admin',
        joinedAt: now,
        lastLogin: now
      };
      
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
      localStorage.setItem(TOKEN_KEY, 'admin-token-' + Date.now());
      return adminUser;
    }

    // 2. DEMO USER HARDCODED
    if (email === 'user' && password === 'user123') {
      const demoUser: User = {
        name: 'Usuário Demo',
        phone: '11999999999',
        email: 'user@demo.com',
        company: 'Empresa Demo Ltda',
        role: 'user',
        joinedAt: now,
        lastLogin: now
      };
      
      localStorage.setItem(SESSION_KEY, JSON.stringify(demoUser));
      localStorage.setItem(TOKEN_KEY, 'demo-token-' + Date.now());
      
      // Atualiza ou insere o usuário demo no DB para aparecer no painel admin
      const usersDb = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
      const existingIndex = usersDb.findIndex((u: User) => u.email === demoUser.email);
      if (existingIndex >= 0) {
        usersDb[existingIndex].lastLogin = now;
      } else {
        usersDb.push(demoUser);
      }
      localStorage.setItem(DB_USERS_KEY, JSON.stringify(usersDb));

      return demoUser;
    }

    // 3. USUÁRIOS REGISTRADOS
    const usersDb = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
    // Simulação simples: Na vida real validaria senha hash. Aqui só checa email.
    const foundUserIndex = usersDb.findIndex((u: User) => u.email === email);
    
    if (foundUserIndex >= 0) {
      const foundUser = usersDb[foundUserIndex];
      // Atualiza lastLogin
      foundUser.lastLogin = now;
      usersDb[foundUserIndex] = foundUser;
      localStorage.setItem(DB_USERS_KEY, JSON.stringify(usersDb));

      localStorage.setItem(SESSION_KEY, JSON.stringify(foundUser));
      localStorage.setItem(TOKEN_KEY, 'mock-token-' + Date.now());
      return foundUser;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  
  const userStr = localStorage.getItem(SESSION_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Função exclusiva para o Admin
export const getAllUsers = (): User[] => {
  initDB();
  const users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]');
  // Retorna ordenado por último login (mais recente primeiro)
  return users.sort((a: User, b: User) => {
    const dateA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
    const dateB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
    return dateB - dateA;
  });
};
