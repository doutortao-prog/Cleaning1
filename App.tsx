
import React, { useState, useEffect } from 'react';
import { User, Brand } from './types';
import { getCurrentUser, logoutUser } from './services/authService';
import { getCatalog } from './services/catalogService';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ChatAssistant } from './components/ChatAssistant';
import { AdminDashboard } from './pages/AdminDashboard';
import { VideoLibrary } from './pages/VideoLibrary';
import { Button } from './components/Button';

type ViewState = 'dashboard' | 'admin' | 'video-library';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      // Se for admin, redireciona para dashboard admin
      if (storedUser.role === 'admin') {
        setCurrentView('admin');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    const u = getCurrentUser();
    setUser(u);
    if (u?.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentView('dashboard');
    setAuthView('login');
  };

  const handleDownloadCatalog = async (brand: Brand) => {
    try {
        const file = await getCatalog(brand);
        if (file) {
            // Cria um link temporário para download
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert(`O catálogo ${brand === Brand.UNGER ? 'Unger' : 'El Castor'} ainda não foi disponibilizado pelo administrador.`);
        }
    } catch (error) {
        console.error("Erro ao baixar catálogo", error);
        alert("Erro ao processar o download.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  // Authentication Flow
  if (!user) {
    return authView === 'login' ? (
      <Login 
        onSuccess={handleLoginSuccess} 
        onSwitchToRegister={() => setAuthView('register')} 
      />
    ) : (
      <Register 
        onSuccess={handleLoginSuccess} 
        onSwitchToLogin={() => setAuthView('login')} 
      />
    );
  }

  // Authenticated App Layout
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentView(user.role === 'admin' ? 'admin' : 'dashboard')}>
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="h-8 w-8 bg-brand-600 rounded flex items-center justify-center text-white font-bold">CM</div>
                <span className="font-bold text-xl text-gray-900 hidden sm:block">
                    CleanMaster AI {user.role === 'admin' && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded ml-2">ADMIN</span>}
                </span>
              </div>
              
              {/* Menu simplificado: Apenas Admin tem navegação extra */}
              {user.role === 'admin' && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`${currentView === 'admin' ? 'border-brand-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16`}
                  >
                    Painel Administrativo
                  </button>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`${currentView === 'dashboard' ? 'border-brand-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16`}
                  >
                    Visão do Usuário
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-4 hidden md:block">
                  <strong>{user.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative pb-20">
        
        {/* Admin View */}
        {currentView === 'admin' && user.role === 'admin' && (
            <div className="animate-fade-in">
                <AdminDashboard />
            </div>
        )}

        {/* Video Library View */}
        {currentView === 'video-library' && (
            <VideoLibrary onBack={() => setCurrentView('dashboard')} />
        )}

        {/* Dashboard View (User & Admin preview) */}
        {currentView === 'dashboard' && (
          <div className="flex flex-col items-center justify-start space-y-6 animate-fade-in">
            
            {/* 1. Chat Assistant - Central Focus */}
            <div className="w-full max-w-4xl">
                 <ChatAssistant activeBrand={Brand.NONE} mode="embedded" />
            </div>

            {/* 2. Action Cards Grid */}
            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
               
               {/* Unger Download */}
               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center justify-between hover:border-unger-green transition-all hover:shadow-md gap-3">
                 <div className="bg-unger-green/10 p-3 rounded-full text-unger-green">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 text-sm">Catálogo Unger</h3>
                    <p className="text-xs text-gray-500 mt-1">Ferramentas para Vidros</p>
                 </div>
                 <Button variant="unger" onClick={() => handleDownloadCatalog(Brand.UNGER)} className="w-full text-xs">
                    Baixar PDF
                 </Button>
               </div>

               {/* El Castor Download */}
               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center justify-between hover:border-elcastor-red transition-all hover:shadow-md gap-3">
                 <div className="bg-elcastor-red/10 p-3 rounded-full text-elcastor-red">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 text-sm">Catálogo El Castor</h3>
                    <p className="text-xs text-gray-500 mt-1">Técnico & Código de Cores</p>
                 </div>
                 <Button variant="elcastor" onClick={() => handleDownloadCatalog(Brand.EL_CASTOR)} className="w-full text-xs">
                    Baixar PDF
                 </Button>
               </div>

               {/* Video Library Button */}
               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center justify-between hover:border-brand-500 transition-all hover:shadow-md gap-3 sm:col-span-2 md:col-span-1">
                 <div className="bg-brand-100 p-3 rounded-full text-brand-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 text-sm">Galeria de Vídeos</h3>
                    <p className="text-xs text-gray-500 mt-1">Treinamento e Apoio</p>
                 </div>
                 <Button variant="primary" onClick={() => setCurrentView('video-library')} className="w-full text-xs">
                    Acessar Vídeos
                 </Button>
               </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer System Info */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()} CleanMaster AI. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xs font-mono text-gray-500">
                    Versão do Sistema: <span className="font-bold text-gray-700">v1.2 (Atualizado)</span>
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
