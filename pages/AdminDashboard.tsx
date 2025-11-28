
import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/authService';
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
  }, []);

  const refreshData = async () => {
    setUsers(getAllUsers());
    
    // Catálogos
    const unger = await getCatalog(Brand.UNGER);
    setUngerCatalog(unger);
    const elCastor = await getCatalog(Brand.EL_CASTOR);
    setElCastorCatalog(elCastor);

    // Vídeos
    const allVideos = await getVideos();
    setVideos(allVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

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
      alert(`Catálogo ${brand} atualizado com sucesso!`);
      refreshData();
    } else {
      alert('Erro ao salvar o arquivo. Tente novamente.');
    }
  };

  const handleDeleteCatalog = async (brand: Brand) => {
    if (window.confirm(`Tem certeza que deseja remover o catálogo ${brand}?`)) {
      await removeCatalog(brand);
      refreshData();
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle) {
      alert("Digite um título.");
      return;
    }

    if (newVideoType === 'link' && !newVideoLink) {
      alert("Digite o link do vídeo.");
      return;
    }

    if (newVideoType === 'file' && !newVideoFile) {
      alert("Selecione um arquivo de vídeo.");
      return;
    }

    setUploadingVideo(true);

    let data = '';
    if (newVideoType === 'link') {
      data = newVideoLink;
    } else if (newVideoFile) {
      // Convert file to base64
      data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(newVideoFile);
      });
    }

    const newVideo: VideoResource = {
      id: Date.now().toString(),
      title: newVideoTitle,
      brand: newVideoBrand,
      type: newVideoType,
      data: data,
      createdAt: new Date().toISOString()
    };

    const success = await saveVideo(newVideo);
    setUploadingVideo(false);

    if (success) {
      alert("Vídeo adicionado com sucesso!");
      setNewVideoTitle('');
      setNewVideoLink('');
      setNewVideoFile(null);
      refreshData();
    } else {
      alert("Erro ao salvar vídeo. Se for um arquivo, verifique se não é muito grande.");
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (window.confirm("Deseja remover este vídeo?")) {
      await deleteVideo(id);
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
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors`}
          >
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('catalogs')}
            className={`${
              activeTab === 'catalogs'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors`}
          >
            Catálogos PDF
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`${
              activeTab === 'videos'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors`}
          >
            Gestão de Vídeos
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'users' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Base de Usuários</h2>
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                Total: {users.length}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome / Empresa</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Papel</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastro</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Login</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        <div className="text-sm text-gray-500">{u.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{u.email}</div>
                        <div className="text-sm text-gray-500">{u.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {u.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(u.joinedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(u.lastLogin)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'catalogs' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900">Upload de Catálogos Digitais</h2>
            <p className="text-gray-500 text-sm">Carregue os arquivos PDF originais.</p>
            
            {/* UNGER Upload */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-unger-dark mb-2">Catálogo Unger</h3>
                  {ungerCatalog ? (
                    <div className="mb-4">
                      <p className="text-sm text-green-600 font-medium">✅ Arquivo Atual: {ungerCatalog.name}</p>
                      <p className="text-xs text-gray-500">Enviado em: {formatDate(ungerCatalog.uploadDate)}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">Nenhum catálogo enviado.</p>
                  )}
                </div>
                {ungerCatalog && (
                  <Button variant="outline" onClick={() => handleDeleteCatalog(Brand.UNGER)} className="text-red-600 border-red-200 hover:bg-red-50">
                    Remover
                  </Button>
                )}
              </div>
              
              <label className="block">
                <span className="sr-only">Escolher arquivo PDF</span>
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, Brand.UNGER)}
                  disabled={loadingFile}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-unger-green file:text-white
                    hover:file:bg-unger-dark
                  "
                />
              </label>
            </div>

            {/* EL CASTOR Upload */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-elcastor-dark mb-2">Catálogo El Castor</h3>
                  {elCastorCatalog ? (
                    <div className="mb-4">
                      <p className="text-sm text-green-600 font-medium">✅ Arquivo Atual: {elCastorCatalog.name}</p>
                      <p className="text-xs text-gray-500">Enviado em: {formatDate(elCastorCatalog.uploadDate)}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">Nenhum catálogo enviado.</p>
                  )}
                </div>
                {elCastorCatalog && (
                  <Button variant="outline" onClick={() => handleDeleteCatalog(Brand.EL_CASTOR)} className="text-red-600 border-red-200 hover:bg-red-50">
                    Remover
                  </Button>
                )}
              </div>
              
              <label className="block">
                <span className="sr-only">Escolher arquivo PDF</span>
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, Brand.EL_CASTOR)}
                  disabled={loadingFile}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-elcastor-red file:text-white
                    hover:file:bg-elcastor-dark
                  "
                />
              </label>
            </div>

            {loadingFile && (
                <div className="text-center text-brand-600 font-medium animate-pulse">
                    Processando e salvando arquivo no banco de dados local...
                </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900">Biblioteca de Vídeos de Apoio</h2>
            
            {/* Form de Adição */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-700 mb-4">Adicionar Novo Vídeo</h3>
              <form onSubmit={handleAddVideo} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Título do Vídeo" 
                    value={newVideoTitle} 
                    onChange={(e) => setNewVideoTitle(e.target.value)} 
                    placeholder="Ex: Como usar o rodo..."
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                    <select 
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                      value={newVideoBrand}
                      onChange={(e) => setNewVideoBrand(e.target.value as Brand)}
                    >
                      <option value={Brand.EL_CASTOR}>El Castor</option>
                      <option value={Brand.UNGER}>Unger</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origem do Vídeo</label>
                  <div className="flex gap-4 mb-3">
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio text-brand-600" name="videoType" value="link" checked={newVideoType === 'link'} onChange={() => setNewVideoType('link')} />
                      <span className="ml-2 text-sm text-gray-700">Link Externo (Youtube, Instagram, etc)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio text-brand-600" name="videoType" value="file" checked={newVideoType === 'file'} onChange={() => setNewVideoType('file')} />
                      <span className="ml-2 text-sm text-gray-700">Upload de Arquivo (MP4)</span>
                    </label>
                  </div>

                  {newVideoType === 'link' ? (
                    <Input 
                      label="URL do Vídeo" 
                      value={newVideoLink} 
                      onChange={(e) => setNewVideoLink(e.target.value)} 
                      placeholder="https://..."
                    />
                  ) : (
                    <input 
                      type="file" 
                      accept="video/mp4"
                      onChange={(e) => setNewVideoFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                  )}
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={uploadingVideo}>
                    {uploadingVideo ? 'Salvando...' : 'Adicionar Vídeo'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Lista de Vídeos */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">Vídeos Cadastrados ({videos.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((v) => (
                  <div key={v.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${v.brand === Brand.UNGER ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {v.brand === Brand.UNGER ? 'Unger' : 'El Castor'}
                        </span>
                        <span className="text-xs text-gray-400">{v.type === 'file' ? 'Arquivo' : 'Link'}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{v.title}</h4>
                      <p className="text-xs text-gray-500 truncate" title={v.type === 'link' ? v.data : 'Arquivo Local'}>
                        {v.type === 'link' ? v.data : 'Vídeo Armazenado Localmente'}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => handleDeleteVideo(v.id)}
                        className="text-red-600 text-xs font-medium hover:text-red-800 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
