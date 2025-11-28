import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { loginUser } from '../services/authService';

interface LoginProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = loginUser(email, password);
      if (user) {
        onSuccess();
      } else {
        setError('Credenciais inválidas. Tente usuário "user" e senha "user123".');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                CM
            </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          CleanMaster AI
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Entre para acessar os catálogos técnicos
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="E-mail ou Usuário"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite 'user' ou seu e-mail"
            />

            <Input
              label="Senha"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-100">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" isLoading={loading}>
                Entrar
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Novo por aqui?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={onSwitchToRegister}>
                Criar conta gratuita
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};