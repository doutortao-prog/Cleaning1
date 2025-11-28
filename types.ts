
export type Role = 'admin' | 'user';

export interface User {
  uid?: string; // ID do Firebase
  name: string;
  phone: string;
  email: string;
  company: string;
  role: Role;
  approved: boolean; // Novo campo: se o admin aprovou o cadastro
  joinedAt?: string;
  lastLogin?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export enum Brand {
  UNGER = 'UNGER',
  EL_CASTOR = 'EL_CASTOR',
  NONE = 'NONE'
}

// Novos tipos para a resposta rica da IA
export type ProductColorCode = '+W' | '+K' | '+R' | '+O' | '+Y' | '+G' | '+B' | '+P' | '+T';

export type ProductSector = 
  | 'HOTELARIA' 
  | 'ALIMENTICIA' 
  | 'HOSPITALAR' 
  | 'INDUSTRIA' 
  | 'LIMPEZA' 
  | 'VEICULOS';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  brand: Brand;
  specs?: string; 
  availableColors?: ProductColorCode[]; 
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CatalogFile {
  name: string;
  url: string; // Mudou de 'data' (base64) para 'url' (link nuvem)
  type: string;
  uploadDate: string;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  description: string;
  specs: string;
  colors: ProductColorCode[]; 
  sectors: ProductSector[];   
}

export interface VideoResource {
  id: string;
  title: string;
  brand: Brand;
  type: 'file' | 'link';
  data: string; // URL do vídeo (seja youtube ou firebase storage)
  createdAt: string;
}