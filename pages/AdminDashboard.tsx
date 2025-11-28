
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

  // Video States
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoBrand, setNewVideoBrand] = useState<Brand>(Brand.EL_CASTOR);
  const [newVideoType, setNewVideoType] = useState<'file' | 'link'>('link');
  const [newVideoLink, setNewVideoLink] = useState('');
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
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

  // --- CATALOGOS ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, brand: Brand) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Por favor, envie apenas arquivos PDF.');
      return;
    }

    setLoadingFile(true);
    const success = await saveCatalog(brand, file);
    setLoadingFile(false);
    
    if (success) {
      alert(`Catálogo ${brand} atualizado na NUVEM com sucesso!`);
      refreshData();
    } else {
      alert('Erro ao salvar o arquivo. Verifique sua conexão.');
    }
  };

  const handleDeleteCatalog = async (brand: Brand) => {
    if (window.confirm(`Tem certeza que deseja remover o catálogo ${brand}?`)) {
      await removeCatalog(brand);
      refreshData();
    }
  };

  // --- VIDEOS ---
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle) return alert("Digite um título.");
    if (newVideoType === 'link' && !newVideoLink) return alert("Digite o link.");
    if (newVideoType === 'file' && !newVideoFile) return alert("Selecione um arquivo.");

    setUploadingVideo(true);

    const newVideo: VideoResource = {
      id: Date.now().toString(),
      title: newVideoTitle,
      brand: newVideoBrand,
      type: newVideoType,
      data: newVideoType === 'link' ? newVideoLink : '', // URL será preenchida no service se for arquivo
      createdAt: new Date().toISOString()
    };

    const success = await saveVideo(newVideo, newVideoFile || undefined);
    setUploadingVideo(false);

    if (success) {
      alert("Vídeo adicionado à biblioteca central com sucesso!");
      setNewVideoTitle('');
      setNewVideoLink('');
      setNewVideoFile(null);
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

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('pt-BR');
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

        {/* Catalog and Video Tabs remain similar but use async calls */}
        {activeTab === 'catalogs' && (
             <div className="space-y-8">
                {/* UNGER */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-bold text-unger-dark mb-2">Catálogo Unger</h3>
                    {ungerCatalog ? <p className="text-green-600 text-sm mb-4">✅ Arquivo Online: {ungerCatalog.name}</p> : <p className="text-gray-500 text-sm mb-4">Sem arquivo na nuvem.</p>}
                    <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, Brand.UNGER)} disabled={loadingFile} />
                </div>
                {/* EL CASTOR */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-bold text-elcastor-dark mb-2">Catálogo El Castor</h3>
                    {elCastorCatalog ? <p className="text-green-600 text-sm mb-4">✅ Arquivo Online: {elCastorCatalog.name}</p> : <p className="text-gray-500 text-sm mb-4">Sem arquivo na nuvem.</p>}
                    <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, Brand.EL_CASTOR)} disabled={loadingFile} />
                </div>
                {loadingFile && <p className="text-center text-blue-600 animate-pulse">Enviando para o servidor...</p>}
             </div>
        )}

        {activeTab === 'videos' && (
            <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold mb-4">Adicionar Vídeo</h3>
                    <form onSubmit={handleAddVideo} className="space-y-4">
                        <Input label="Título" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} />
                        <select className="w-full p-2 border rounded" value={newVideoBrand} onChange={e => setNewVideoBrand(e.target.value as Brand)}>
                            <option value={Brand.EL_CASTOR}>El Castor</option>
                            <option value={Brand.UNGER}>Unger</option>
                        </select>
                        <div className="flex gap-4">
                            <label><input type="radio" name="vtype" checked={newVideoType === 'link'} onChange={() => setNewVideoType('link')} /> Link</label>
                            <label><input type="radio" name="vtype" checked={newVideoType === 'file'} onChange={() => setNewVideoType('file')} /> Arquivo</label>
                        </div>
                        {newVideoType === 'link' ? 
                            <Input label="URL" value={newVideoLink} onChange={e => setNewVideoLink(e.target.value)} /> :
                            <input type="file" accept="video/mp4" onChange={e => setNewVideoFile(e.target.files?.[0] || null)} />
                        }
                        <Button type="submit" disabled={uploadingVideo}>{uploadingVideo ? 'Enviando...' : 'Salvar'}</Button>
                    </form>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.map(v => (
                        <div key={v.id} className="border p-4 rounded bg-white flex justify-between items-center">
                            <div>
                                <p className="font-bold">{v.title}</p>
                                <p className="text-xs text-gray-500">{v.type === 'file' ? 'Arquivo' : 'Link Externo'}</p>
                            </div>
                            <button onClick={() => handleDeleteVideo(v.id, v.type)} className="text-red-500 text-sm">Excluir</button>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};