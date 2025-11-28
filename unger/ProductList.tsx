
import React, { useState, useEffect } from 'react';
import { Product, Brand, CatalogFile } from '../types';
import { getCatalog } from '../services/catalogService';
import { Button } from '../components/Button';

const MOCK_UNGER_PRODUCTS: Product[] = [
  {
    id: 'EN000',
    name: 'ErgoTec® Ninja Rodo Completo',
    description: 'Rodo profissional premium com canal de alumínio aeronáutico T6 extrudado (não dobra). Mecanismo TriLoc para segurança do canal. Ângulo de trabalho de 40°.',
    category: 'Limpeza de Vidros',
    imageUrl: '',
    brand: Brand.UNGER,
    specs: 'Material: Alumínio T6 e Plástico Bi-componente. Borracha: Soft (Shore 53) ou Hard (Shore 60). Comprimentos: 30cm a 105cm.'
  },
  {
    id: 'DIK12',
    name: 'HydroPower® Ultra Kit S',
    description: 'Sistema de deionização de água para limpeza de vidros em altura sem químicos. Produz água 100% pura através de troca iônica.',
    category: 'Água Pura',
    imageUrl: '',
    brand: Brand.UNGER,
    specs: 'Produção: Até 120L/h. Filtro: Resina mista (Cátion/Ânion). Conexão: Padrão Gardena. Peso: Portátil.'
  },
  {
    id: 'SRKT1',
    name: 'Stingray® Kit de Limpeza Interna',
    description: 'Limpeza de vidros internos até 4m de altura sem escadas. Sistema aplica solução de limpeza no pad de microfibra, evitando gotejamento.',
    category: 'Vidros Internos',
    imageUrl: '',
    brand: Brand.UNGER,
    specs: 'Alcance: 4m (com extensões). Bateria: 2x AA (para bomba). Pad: Triangula Microfibra.'
  },
  {
    id: 'NT090',
    name: 'NiftyNabber® Pro',
    description: 'Pinça pegadora de detritos para uso externo e pesado. Garras de aço revestidas de borracha para força máxima de agarre.',
    category: 'Manutenção',
    imageUrl: '',
    brand: Brand.UNGER,
    specs: 'Comprimento: 90cm. Capacidade de carga: Alta. Material: Aço Tubular.'
  }
];

export const UngerCatalog: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [catalogPdf, setCatalogPdf] = useState<CatalogFile | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
        const pdf = await getCatalog(Brand.UNGER);
        if (pdf) {
            setCatalogPdf(pdf);
        }
    };
    loadPdf();
  }, []);

  const filtered = MOCK_UNGER_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(filter.toLowerCase()) || 
      p.id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-unger-green text-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold mb-1">Catálogo Unger</h2>
                <p className="text-sm opacity-90">Ferramentas profissionais para vidros e manutenção predial.</p>
            </div>
             {catalogPdf && (
                <div className="flex gap-2">
                    <a href={catalogPdf.url} download={catalogPdf.name} className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-unger-green bg-white hover:bg-gray-100 transition-colors shadow-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Baixar PDF Original
                    </a>
                </div>
            )}
        </div>
        
        <div className="mt-4">
             <input 
                type="text" 
                placeholder="Buscar ferramenta Unger..." 
                className="w-full max-w-md px-4 py-2 text-sm rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white placeholder-gray-500 shadow-sm"
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
                            <Button variant="unger">Clique aqui para baixar</Button>
                        </a>
                    </div>
                  </object>
              </div>
          </div>
      )}

      {/* Product List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 border-l-4 border-unger-green pl-3">
             Destaques do Catálogo
        </h3>
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-unger-green transition-all shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-bold text-unger-dark uppercase bg-green-50 px-2 py-1 rounded">{product.category}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">{product.name}</h3>
              </div>
              <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">ID: {product.id}</span>
            </div>
            
            <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
            
            {product.specs && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 flex gap-2 items-start">
                <svg className="w-5 h-5 text-unger-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{product.specs}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
