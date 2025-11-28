
export type Role = 'admin' | 'user';

export interface User {
  name: string;
  phone: string;
  email: string;
  company: string;
  role: Role;
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

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  brand: Brand;
  specs?: string; // Informações técnicas extras (ex: Material, Temp Max, Resistência Química)
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CatalogFile {
  name: string;
  data: string; // Base64 string
  type: string;
  uploadDate: string;
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

export interface RecommendedProduct {
  id: string;
  name: string;
  description: string;
  specs: string;
  colors: ProductColorCode[]; // Lista de códigos de cores disponíveis
  sectors: ProductSector[];   // Lista de setores recomendados
}
