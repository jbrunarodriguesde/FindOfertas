import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { ShieldCheck, ArrowRight, Lock, Mail, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('ana.silva@exemplo.com');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, 'Ana Silva');
    navigate('dashboard');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6">
        
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Acesse sua conta</h1>
          <p className="text-xs text-slate-500">
            Acompanhe seus benefícios, cartões e histórico de economia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-[#003ec7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-[#003ec7]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#003ec7] hover:bg-[#0030a0] text-white font-bold py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            <span>Entrar no Compara+</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Não tem uma conta?{' '}
          <button
            onClick={() => navigate('register')}
            className="font-bold text-[#003ec7] hover:underline"
          >
            Criar conta grátis
          </button>
        </div>

      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { login, navigate } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'novo.usuario@exemplo.com', name || 'Novo Usuário');
    navigate('wallet');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6">
        
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Crie sua conta no Compara+</h1>
          <p className="text-xs text-slate-500">
            Cadastre-se para personalizar os cálculos com seus cartões e benefícios
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Seu Nome Completo</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Ex: Carlos Eduardo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-[#003ec7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-[#003ec7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Criar Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-[#003ec7]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#003ec7] hover:bg-[#0030a0] text-white font-bold py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            <span>Cadastrar e Começar a Economizar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Já possui conta?{' '}
          <button
            onClick={() => navigate('login')}
            className="font-bold text-[#003ec7] hover:underline"
          >
            Fazer login
          </button>
        </div>

      </div>
    </div>
  );
};
