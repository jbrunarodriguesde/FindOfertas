import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatCompactNumber } from '../utils/formatters';
import { 
  TrendingUp, 
  Wallet, 
  Star, 
  CreditCard, 
  Bell, 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export const DashboardPage: React.FC = () => {
  const { userProfile, userCards, userAlerts, favoriteProductIds, navigate, setIsAddCardModalOpen } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <span className="bg-slate-800 text-blue-400 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-slate-700">
            Painel do Usuário
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Olá, {userProfile.name}! 👋
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Seu assistente inteligente já calculou <strong className="text-white">R$ 1.840,00</strong> em economias acumuladas em comparação ao preço bruto.
          </p>
        </div>

        <button
          onClick={() => navigate('search')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-blue-600/30 transition-all flex-shrink-0 relative z-10 active:scale-95"
        >
          Nova Comparação
        </button>
      </div>

      {/* 4 Metrics KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Cashback</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatCurrency(userProfile.totalCashbackBalance)}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">Disponível p/ Pix</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Pontos & Milhas</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatCompactNumber(userProfile.totalPointsBalance + userProfile.totalMilesBalance)}
          </div>
          <span className="text-[11px] text-blue-600 font-bold block">Em 2 programas</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Alertas Ativos</span>
            <Bell className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {userAlerts.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">Monitorando 24h</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Cartões Ativos</span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {userCards.filter(c => c.active).length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">Multiplicando pontos</span>
        </div>

      </div>

      {/* 2-Column Split: Active Alerts & Saved Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Saved Cards */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Meus Cartões Cadastrados
            </h2>
            <button
              onClick={() => navigate('wallet')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-2.5">
            {userCards.map(card => (
              <div key={card.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{card.name}</h4>
                  <p className="text-[11px] text-slate-500">{card.bank} • {card.pointsPerUsd} pts/US$</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {card.cashbackRate}% Cashback
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsAddCardModalOpen(true)}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors text-center active:scale-98"
          >
            + Cadastrar Novo Cartão
          </button>
        </div>

        {/* Right: Monitored Alerts */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Alertas de Preço Ativos
            </h2>
            <button
              onClick={() => navigate('alerts')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Gerenciar
            </button>
          </div>

          <div className="space-y-2.5">
            {userAlerts.slice(0, 3).map(alert => (
              <div key={alert.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{alert.productName}</h4>
                  <p className="text-[11px] text-slate-500">Meta: {formatCurrency(alert.targetPrice)}</p>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex-shrink-0">
                  {formatCurrency(alert.currentEffectivePrice)}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('search')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors text-center active:scale-98"
          >
            + Criar Novo Alerta
          </button>
        </div>

      </div>

    </div>
  );
};
