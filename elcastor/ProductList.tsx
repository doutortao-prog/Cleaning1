
import React, { useState, useEffect } from 'react';
import { EL_CASTOR_PRODUCTS } from './catalogData';
import { getCatalog } from '../services/catalogService';
import { Brand, CatalogFile } from '../types';
import { Button } from '../components/Button';

export const ElCastorCatalog: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [catalogPdf, setCatalogPdf] = useState<CatalogFile | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
        const pdf = await getCatalog(Brand.EL_CASTOR);
        if (pdf) {
            setCatalogPdf(pdf);
        }
    };
    loadPdf();
  }, []);

  const filteredProducts = EL_CASTOR_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.category.toLowerCase().includes(filter.toLowerCase()) ||
    (p.specs && p.specs.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-elcastor-red text-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold mb-1">Catálogo Técnico El Castor</h2>
                <p className="text-sm opacity-90">Lista oficial de ferramentas com especificações de material e resistência.</p>
            </div>
            {catalogPdf && (
                <div className="flex gap-2">
                    <a href={catalogPdf.url} download={catalogPdf.name} className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-elcastor-red bg-white hover:bg-gray-100 transition-colors shadow-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Baixar PDF Original
                    </a>
                </div>
            )}
        </div>
        
        <div className="mt-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input 
                type="text" 
                placeholder="Buscar por nome, código ou material (ex: PBT, 120°C)..." 
                className="w-full pl-10 px-4 py-3 text-sm rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white placeholder-gray-500 shadow-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>
      </div>

      {/* PDF Viewer */}
      {catalogPdf && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-700">Visualização do Documento Oficial</h3>
              </div>
              <div className="w-full h-[800px]">
                  <object
                    data={catalogPdf.url}
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
                        <p>Seu navegador não suporta visualização de PDF integrada.</p>
                        <a href={catalogPdf.url} download={catalogPdf.name}>
                            <Button variant="elcastor">Clique aqui para baixar</Button>
                        </a>
                    </div>
                  </object>
              </div>
          </div>
      )}

      {/* Technical List Fallback/Complement */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 border-l-4 border-elcastor-red pl-3">
             Índice Detalhado de Produtos
        </h3>
        <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-elcastor-red transition-all shadow-sm hover:shadow-md">
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-elcastor-dark uppercase bg-red-50 px-2 py-0.5 rounded border border-red-100 tracking-wide">
                                {product.category}
                            </span>
                            {product.specs?.includes("PBT") && (
                                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                    Indústria Alimentícia
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 leading-snug">{product.name}</h3>
                    </div>
                    <div className="mt-2 sm:mt-0 flex-shrink-0">
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                            REF: {product.id}
                        </span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Descrição</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Dados Técnicos
                        </h4>
                        {product.specs ? (
                            <ul className="text-sm text-gray-600 space-y-1">
                                {product.specs.split('. ').map((spec, i) => (
                                    spec ? <li key={i} className="flex items-start gap-2">
                                        <span className="w-1 h-1 bg-elcastor-red rounded-full mt-2 flex-shrink-0"></span>
                                        <span>{spec.replace('.', '')}</span>
                                    </li> : null
                                ))}
                            </ul>
                        ) : (
                            <span className="text-xs text-gray-400 italic">Consulte o assistente para detalhes.</span>
                        )}
                    </div>
                </div>

            </div>
            ))}
        </div>
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-lg font-medium">Nenhum produto encontrado</p>
            <p className="text-sm">Tente buscar por código ou especificação (ex: "autoclavável")</p>
        </div>
      )}
    </div>
  );
};
