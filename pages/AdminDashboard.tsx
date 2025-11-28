
import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/authService';
import { saveCatalog, getCatalog, removeCatalog } from '../services/catalogService';
import { User, Brand, CatalogFile } from '../types';
import { Button } from '../components/Button';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'catalogs'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [ungerCatalog, setUngerCatalog] = useState<CatalogFile | null>(null);
  const [elCastorCatalog, setElCastorCatalog] = useState<CatalogFile | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setUsers(getAllUsers());
    
    // Agora getCatalog é assíncrono
    const unger = await getCatalog(Brand.UNGER);
    setUngerCatalog(unger);
    
    const elCastor = await getCatalog(Brand.EL_CASTOR);
    setElCastorCatalog(elCastor);
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
            } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          >
            Usuários Cadastrados
          </button>
          <button
            onClick={() => setActiveTab('catalogs')}
            className={`${
              activeTab === 'catalogs'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          >
            Gestão de Catálogos (PDF)
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'users' ? (
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
        ) : (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900">Upload de Catálogos Digitais</h2>
            <p className="text-gray-500 text-sm">Carregue os arquivos PDF originais. O sistema usa IndexedDB para suportar arquivos grandes.</p>
            
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
      </div>
    </div>
  );
};
