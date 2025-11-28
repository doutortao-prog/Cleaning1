import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { registerUser } from '../services/authService';

interface RegisterProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.company) {
      setError('Por favor preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      const success = registerUser({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: formData.company
      }, formData.password);

      if (success) {
        onSuccess();
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Acesse o catálogo completo da CleanMaster
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Nome Completo"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
            />
            
            <Input
              label="Empresa"
              name="company"
              type="text"
              required
              value={formData.company}
              onChange={handleChange}
            />

            <Input
              label="Celular"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              label="E-mail"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Senha"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" isLoading={loading}>
                Cadastrar
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
                  Já tem uma conta?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={onSwitchToLogin}>
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};