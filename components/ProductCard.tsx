import React from 'react';
import { RecommendedProduct, ProductColorCode, ProductSector } from '../types';

interface ProductCardProps {
  product: RecommendedProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  
  // Mapeamento de Cores
  const getColorStyle = (code: ProductColorCode) => {
    switch (code) {
      case '+W': return { bg: '#FFFFFF', border: '#E5E7EB', name: 'Branco' };
      case '+K': return { bg: '#000000', border: '#000000', name: 'Preto' };
      case '+R': return { bg: '#EF4444', border: '#EF4444', name: 'Vermelho' };
      case '+O': return { bg: '#F97316', border: '#F97316', name: 'Laranja' };
      case '+Y': return { bg: '#EAB308', border: '#EAB308', name: 'Amarelo' };
      case '+G': return { bg: '#22C55E', border: '#22C55E', name: 'Verde' };
      case '+B': return { bg: '#3B82F6', border: '#3B82F6', name: 'Azul' };
      case '+P': return { bg: '#A855F7', border: '#A855F7', name: 'Roxo' };
      case '+T': return { bg: '#78350F', border: '#78350F', name: 'Café' };
      default: return { bg: '#9CA3AF', border: '#9CA3AF', name: 'N/A' };
    }
  };

  // Mapeamento de Ícones de Setor
  const getSectorIcon = (sector: ProductSector) => {
    switch (sector) {
      case 'HOTELARIA':
        return (
          <div className="flex flex-col items-center gap-1" title="Serviços e Hotelaria">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <span className="text-[10px] font-medium text-gray-500 uppercase">Hotelaria</span>
          </div>
        );
      case 'ALIMENTICIA':
        return (
          <div className="flex flex-col items-center gap-1" title="Indústria Alimentícia">
             <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <span className="text-[10px] font-medium text-gray-500 uppercase">Alimentos</span>
          </div>
        );
      case 'HOSPITALAR':
        return (
          <div className="flex flex-col items-center gap-1" title="Hospitais e Clínicas">
             <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="text-[10px] font-medium text-gray-500 uppercase">Hospitalar</span>
          </div>
        );
      case 'INDUSTRIA':
        return (
          <div className="flex flex-col items-center gap-1" title="Indústria em Geral">
             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <span className="text-[10px] font-medium text-gray-500 uppercase">Indústria</span>
          </div>
        );
      case 'LIMPEZA':
        return (
          <div className="flex flex-col items-center gap-1" title="Limpeza Profissional">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <span className="text-[10px] font-medium text-gray-500 uppercase">Profissional</span>
          </div>
        );
      case 'VEICULOS':
        return (
          <div className="flex flex-col items-center gap-1" title="Cuidado de Veículos">
             <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-[10px] font-medium text-gray-500 uppercase">Veículos</span>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-4 mb-2 max-w-sm">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-900 leading-tight">{product.name}</h3>
          <span className="text-xs font-mono text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 mt-1 inline-block">
            REF: {product.id}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Descrição Completa (Novo Campo) */}
        <div>
           <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Descrição</h4>
           <p className="text-sm text-gray-800 leading-relaxed font-medium">
             {product.description}
           </p>
        </div>

        {/* Specs */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Especificações Técnicas</h4>
          <p className="text-sm text-gray-600 bg-blue-50/30 p-2 rounded border border-blue-100/50 leading-snug">
            {product.specs}
          </p>
        </div>

        {/* Cores Disponíveis */}
        {product.colors && product.colors.length > 0 && (
          <div>
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Cores Disponíveis</h4>
             <div className="flex flex-wrap gap-2">
               {product.colors.map(colorCode => {
                 const style = getColorStyle(colorCode);
                 return (
                   <div key={colorCode} className="flex flex-col items-center">
                     <div 
                        className="w-6 h-6 rounded-full shadow-sm"
                        style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}
                        title={style.name}
                     />
                     <span className="text-[10px] text-gray-500 mt-0.5">{colorCode}</span>
                   </div>
                 );
               })}
             </div>
          </div>
        )}

        {/* Setores Recomendados */}
        {product.sectors && product.sectors.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Setores Recomendados</h4>
            <div className="flex flex-wrap gap-4">
              {product.sectors.map(sector => (
                <div key={sector}>
                  {getSectorIcon(sector)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};