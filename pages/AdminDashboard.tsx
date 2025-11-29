import React, { useState, useEffect } from 'react';
import { getAllUsers, approveUser, deleteUserDb } from '../services/authService';
import { saveCatalog, getCatalog, removeCatalog, saveVideo, getVideos, deleteVideo } from '../services/catalogService';
import { User, Brand, CatalogFile, VideoResource } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'catalogs' | 'videos'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [ungerCatalog, setUngerCatalog] = useState<CatalogFile | null>(null);
  const [elCastorCatalog, setElCastorCatalog] = useState<CatalogFile | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);

  // Estados para Links de Catálogo
  const [ungerLink, setUngerLink] = useState('');
  const [elCastorLink, setElCastorLink] = useState('');

  // Video States
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoBrand, setNewVideoBrand] = useState<Brand>(Brand.EL_CASTOR);
  const [newVideoLink, setNewVideoLink] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const refreshData = async () => {
    if (activeTab === 'users') {
        const u = await getAllUsers();
        setUsers(u);
    }
    
    if (activeTab === 'catalogs') {
        const unger = await getCatalog(Brand.UNGER);
        setUngerCatalog(unger);
        const elCastor = await getCatalog(Brand.EL_CASTOR);
        setElCastorCatalog(elCastor);
    }

    if (activeTab === 'videos') {
        const allVideos = await getVideos();
        setVideos(allVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  // --- CATALOGOS (Híbrido: Upload ou Link) ---
  const handleCatalogUpdate = async (brand: Brand, file?: File) => {
    setLoadingFile(true);
    let success = false;

    if (file) {
        // Opção 1: Upload Arquivo
        if (file.type !== 'application/pdf') {
            alert('Por favor, envie apenas arquivos PDF.');
            setLoadingFile(false);
            return;
        }
        success = await saveCatalog(brand, file);
    } else {
        // Opção 2: Link
        const link = brand === Brand.UNGER ? ungerLink : elCastorLink;
        if (!link) {
            alert('Digite o link do catálogo.');
            setLoadingFile(false);
            return;
        }
        success = await saveCatalog(brand, link);
    }

    setLoadingFile(false);
    
    if (success) {
      alert(`Catálogo ${brand} atualizado com sucesso!`);
      setUngerLink('');
      setElCastorLink('');
      refreshData();
    } else {
      alert('Erro ao atualizar. Verifique sua conexão.');
    }
  };

  // --- VIDEOS (Apenas Links) ---
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle) return alert("Digite um título.");
    if (!newVideoLink) return alert("Digite o link do vídeo.");

    setUploadingVideo(true);

    const newVideo: VideoResource = {
      id: Date.now().toString(),
      title: newVideoTitle,
      brand: newVideoBrand,
      type: 'link', // Forçado para link
      data: newVideoLink,
      createdAt: new Date().toISOString()
    };

    const success = await saveVideo(newVideo);
    setUploadingVideo(false);

    if (success) {
      alert("Vídeo adicionado à biblioteca central com sucesso!");
      setNewVideoTitle('');
      setNewVideoLink('');
      refreshData();
    } else {
      alert("Erro ao salvar vídeo.");
    }
  };

  const handleDeleteVideo = async (id: string, type: 'file' | 'link') => {
    if (window.confirm("Deseja remover este vídeo?")) {
      await deleteVideo(id, type);
      refreshData();
    }
  };

  // --- USUARIOS ---
  const handleApproveUser = async (uid: string) => {
      if (window.confirm("Aprovar este usuário para acessar o sistema?")) {
          await approveUser(uid);
          refreshData();
      }
  };

  const handleBanUser = async (uid: string) => {
      if (window.confirm("Bloquear acesso deste usuário?")) {
          await deleteUserDb(uid);
          refreshData();
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px px-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500'} w-1/4 py-4 border-b-2 font-medium text-sm transition-colors`}>Usuários</button>
          <button onClick={() => setActiveTab('catalogs')} className={`${activeTab === 'catalogs' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500'} w-1/4 py-4 border-b-2 font-medium text-sm transition-colors`}>Catálogos</button>
          <button onClick={() => setActiveTab('videos')} className={`${activeTab === 'videos' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500'} w-1/4 py-4 border-b-2 font-medium text-sm transition-colors`}>Vídeos</button>
        </nav>
      </div>

      <div className="p-6">
        {/* --- ABA USUÁRIOS --- */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Gestão de Usuários (Central)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        <div className="text-sm text-gray-500">{u.company}</div>
                      </td>
                      <td className="px-6 py-4">
                        {u.role === 'admin' ? (
                            <span className="px-2 py-1 text-xs font-bold rounded bg-purple-100 text-purple-800">ADMIN</span>
                        ) : u.approved ? (
                            <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800">ATIVO</span>
                        ) : (
                            <span className="px-2 py-1 text-xs font-bold rounded bg-yellow-100 text-yellow-800 animate-pulse">PENDENTE</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{u.email}<br/>{u.phone}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        {u.role !== 'admin' && !u.approved && (
                            <Button onClick={() => handleApproveUser(u.uid!)} className="bg-green-600 hover:bg-green-700 text-xs py-1 px-3 mr-2">
                                Aprovar
                            </Button>
                        )}
                        {u.role !== 'admin' && (
                            <button onClick={() => handleBanUser(u.uid!)} className="text-red-600 hover:text-red-900 ml-4">
                                Bloquear
                            </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ABA CATÁLOGOS --- */}
        {activeTab === 'catalogs' && (
             <div className="space-y-8">
                {/* UNGER */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-bold text-unger-dark mb-2">Catálogo Unger</h3>
                    {ungerCatalog ? <p className="text-green-600 text-sm mb-4">✅ Disponível: {ungerCatalog.name}</p> : <p className="text-gray-500 text-sm mb-4">Sem catálogo definido.</p>}
                    
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 block mb-1">Opção 1: Colar Link (Google Drive/Dropbox)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="https://..." 
                                    className="flex-1 p-2 text-sm border rounded"
                                    value={ungerLink}
                                    onChange={(e) => setUngerLink(e.target.value)}
                                />
                                <Button onClick={() => handleCatalogUpdate(Brand.UNGER)} disabled={loadingFile} className="text-xs">Salvar Link</Button>
                            </div>
                        </div>
                        <div className="flex-1 border-l pl-4">
                            <label className="text-xs text-gray-500 block mb-1">Opção 2: Fazer Upload (Se tiver plano)</label>
                            <input type="file" accept="application/pdf" onChange={(e) => handleCatalogUpdate(Brand.UNGER, e.target.files?.[0])} disabled={loadingFile} className="text-sm" />
                        </div>
                    </div>
                </div>

                {/* EL CASTOR */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-bold text-elcastor-dark mb-2">Catálogo El Castor</h3>
                    {elCastorCatalog ? <p className="text-green-600 text-sm mb-4">✅ Disponível: {elCastorCatalog.name}</p> : <p className="text-gray-500 text-sm mb-4">Sem catálogo definido.</p>}
                    
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 block mb-1">Opção 1: Colar Link (Google Drive/Dropbox)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="https://..." 
                                    className="flex-1 p-2 text-sm border rounded"
                                    value={elCastorLink}
                                    onChange={(e) => setElCastorLink(e.target.value)}
                                />
                                <Button onClick={() => handleCatalogUpdate(Brand.EL_CASTOR)} disabled={loadingFile} className="text-xs">Salvar Link</Button>
                            </div>
                        </div>
                        <div className="flex-1 border-l pl-4">
                            <label className="text-xs text-gray-500 block mb-1">Opção 2: Fazer Upload (Se tiver plano)</label>
                            <input type="file" accept="application/pdf" onChange={(e) => handleCatalogUpdate(Brand.EL_CASTOR, e.target.files?.[0])} disabled={loadingFile} className="text-sm" />
                        </div>
                    </div>
                </div>
             </div>
        )}

        {/* --- ABA VÍDEOS (SIMPLIFICADA) --- */}
        {activeTab === 'videos' && (
            <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold mb-4">Adicionar Link de Vídeo</h3>
                    <p className="text-sm text-gray-500 mb-4">Cole links do YouTube, Instagram, Vimeo ou Google Drive.</p>
                    
                    <form onSubmit={handleAddVideo} className="space-y-4">
                        <Input label="Título do Vídeo" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="Ex: Treinamento Limpeza de Vidros" />
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                            <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500" value={newVideoBrand} onChange={e => setNewVideoBrand(e.target.value as Brand)}>
                                <option value={Brand.EL_CASTOR}>El Castor</option>
                                <option value={Brand.UNGER}>Unger</option>
                            </select>
                        </div>

                        <Input label="Link / URL" value={newVideoLink} onChange={e => setNewVideoLink(e.target.value)} placeholder="https://..." />
                        
                        <Button type="submit" disabled={uploadingVideo} className="w-full">
                            {uploadingVideo ? 'Salvando...' : 'Adicionar à Galeria'}
                        </Button>
                    </form>
                </div>
                
                <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Vídeos Cadastrados</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {videos.map(v => (
                            <div key={v.id} className="border border-gray-200 p-4 rounded-lg bg-white flex justify-between items-center shadow-sm">
                                <div>
                                    <p className="font-bold text-gray-900">{v.title}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded ${v.brand === Brand.UNGER ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {v.brand}
                                    </span>
                                    <p className="text-xs text-blue-600 mt-1 truncate max-w-xs">{v.data}</p>
                                </div>
                                <button onClick={() => handleDeleteVideo(v.id, v.type)} className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors">
                                    Excluir
                                </button>
                            </div>
                        ))}
                        {videos.length === 0 && <p className="text-gray-500 text-sm italic">Nenhum vídeo cadastrado.</p>}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};