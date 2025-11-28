
import React, { useState, useEffect } from 'react';
import { User, Brand } from './types';
import { getCurrentUser, logoutUser } from './services/authService';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UngerCatalog } from './unger/ProductList';
import { ElCastorCatalog } from './elcastor/ProductList';
import { ChatAssistant } from './components/ChatAssistant';
import { AdminDashboard } from './pages/AdminDashboard';

type ViewState = 'dashboard' | 'unger' | 'elcastor' | 'admin';

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

  const getActiveBrand = (): Brand => {
    if (currentView === 'unger') return Brand.UNGER;
    if (currentView === 'elcastor') return Brand.EL_CASTOR;
    return Brand.NONE;
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
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {user.role === 'admin' ? (
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`${currentView === 'admin' ? 'border-brand-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16`}
                  >
                    Painel Administrativo
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className={`${currentView === 'dashboard' ? 'border-brand-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16`}
                    >
                      Dashboard & Assistente
                    </button>
                    <button
                      onClick={() => setCurrentView('unger')}
                      className={`${currentView === 'unger' ? 'border-unger-green text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16`}
                    >
                      Catálogo Unger
                    </button>
                    <button
                      onClick={() => setCurrentView('elcastor')}
                      className={`${currentView === 'elcastor' ? 'border-elcastor-red text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16`}
                    >
                      Catálogo El Castor
                    </button>
                  </>
                )}
              </div>
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* Admin View */}
        {currentView === 'admin' && user.role === 'admin' && (
            <div className="animate-fade-in">
                <AdminDashboard />
            </div>
        )}

        {/* Dashboard View (User) */}
        {currentView === 'dashboard' && user.role !== 'admin' && (
          <div className="flex flex-col items-center justify-start space-y-8 animate-fade-in">
            <div className="text-center w-full max-w-3xl">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Consultor Técnico Inteligente
              </h1>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Utilizo o catálogo técnico completo para diagnosticar sua necessidade de limpeza.
                Pergunte sobre produtos, resistência química ou procedimentos APPCC.
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
               <button 
                onClick={() => setCurrentView('unger')}
                className="p-6 border border-gray-200 rounded-xl bg-white hover:border-unger-green hover:shadow-lg transition-all flex items-center justify-between group"
               >
                 <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-unger-green">Catálogo Unger</h3>
                    <p className="text-sm text-gray-500 mt-1">Ferramentas para vidros e limpeza em altura.</p>
                 </div>
                 <svg className="w-6 h-6 text-gray-300 group-hover:text-unger-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </button>
               <button 
                onClick={() => setCurrentView('elcastor')}
                className="p-6 border border-gray-200 rounded-xl bg-white hover:border-elcastor-red hover:shadow-lg transition-all flex items-center justify-between group"
               >
                 <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-elcastor-red">Catálogo El Castor</h3>
                    <p className="text-sm text-gray-500 mt-1">Escovas técnicas, rodos e código de cores.</p>
                 </div>
                 <svg className="w-6 h-6 text-gray-300 group-hover:text-elcastor-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </button>
            </div>
          </div>
        )}

        {/* Catalog Views (User) */}
        <div className={(currentView === 'dashboard' || currentView === 'admin') ? 'hidden' : 'block animate-fade-in'}>
            {currentView === 'unger' && <UngerCatalog />}
            {currentView === 'elcastor' && <ElCastorCatalog />}
        </div>

      </main>

      {/* 
        Persistent Chat Assistant - Only for Users
      */}
      {user.role !== 'admin' && (
        <div className={
            currentView === 'dashboard' 
            ? "w-full max-w-4xl mx-auto px-4 pb-12" // Embedded Mode Container
            : "" // Floating Mode handles its own positioning
        }>
            <ChatAssistant 
                activeBrand={getActiveBrand()} 
                mode={currentView === 'dashboard' ? 'embedded' : 'floating'}
            />
        </div>
      )}

    </div>
  );
};

export default App;
