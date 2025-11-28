
import React, { useState, useEffect } from 'react';
import { Brand, VideoResource } from '../types';
import { getVideos } from '../services/catalogService';
import { Button } from '../components/Button';

interface VideoLibraryProps {
  onBack: () => void;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<Brand>(Brand.EL_CASTOR);
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, [activeTab]);

  const loadVideos = async () => {
    setLoading(true);
    const data = await getVideos(activeTab);
    // Ordenar por data mais recente
    const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setVideos(sorted);
    setLoading(false);
  };

  const getBrandColor = () => {
    return activeTab === Brand.UNGER ? 'bg-unger-green' : 'bg-elcastor-red';
  };

  const getBrandText = () => {
    return activeTab === Brand.UNGER ? 'text-unger-dark' : 'text-elcastor-dark';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com Navegação */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Galeria de Vídeos</h2>
            <p className="text-sm text-gray-500">Material de apoio e treinamento técnico</p>
          </div>
        </div>

        {/* Abas */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab(Brand.EL_CASTOR)}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === Brand.EL_CASTOR
                ? 'bg-white text-elcastor-red shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            El Castor
          </button>
          <button
            onClick={() => setActiveTab(Brand.UNGER)}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === Brand.UNGER
                ? 'bg-white text-unger-green shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Unger
          </button>
        </div>
      </div>

      {/* Grid de Vídeos */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${activeTab === Brand.UNGER ? 'border-unger-green' : 'border-elcastor-red'}`}></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum vídeo disponível</h3>
          <p className="mt-1 text-sm text-gray-500">Novos conteúdos serão adicionados em breve.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
              {/* Container de Mídia (Aspecto Vertical/Instagram) */}
              <div className="aspect-[9/16] bg-black relative flex items-center justify-center bg-gray-900">
                {video.type === 'file' ? (
                  <video 
                    controls 
                    className="w-full h-full object-cover"
                    src={video.data}
                    preload="metadata"
                  >
                    Seu navegador não suporta vídeos HTML5.
                  </video>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <svg className="w-16 h-16 text-white/80 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <a 
                      href={video.data} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Assistir Externamente
                      <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className={`text-lg font-bold leading-tight mb-2 ${getBrandText()}`}>{video.title}</h3>
                  <span className="text-xs text-gray-400">
                    Adicionado em: {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
