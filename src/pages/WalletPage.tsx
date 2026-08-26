import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Sparkles, 
  Plus, 
  Plane, 
  Star, 
  ShieldCheck, 
  ToggleLeft,
  ToggleRight,
  Calculator,
  Percent
} from 'lucide-react';

export const WalletPage: React.FC = () => {
  const { 
    userCards, 
    toggleCardActive, 
    setIsAddCardModalOpen
  } = useApp();

  const activeCardsCount = userCards.filter(c => c.active).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Benefícios & Cartões</h1>
          <p className="text-xs text-slate-500">
            Configure seus cartões para calcular automaticamente o preço real com pontos, milhas e cashback.
          </p>
        </div>

        <button
          onClick={() => setIsAddCardModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Cartão</span>
        </button>
      </div>

      {/* Benefits Overview Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Simulador de Preço Efetivo</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeCardsCount} {activeCardsCount === 1 ? 'Cartão Ativo' : 'Cartões Ativos'}
            </div>
            <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Os benefícios são aplicados automaticamente em todas as buscas de ofertas
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-800">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="font-medium text-[11px] leading-tight">
              Apenas pontuação e cashback são usados no comparador. Nenhum dado financeiro ou bancário é solicitado.
            </span>
          </div>
        </div>

        {/* Benefits Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Percent className="w-4 h-4 text-emerald-600" />
              <span>Cashback Médio</span>
            </div>
            <div className="text-xl font-black text-slate-900">
              Até 1.5%
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Descontado no custo final
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Pontos por Dólar</span>
            </div>
            <div className="text-xl font-black text-slate-900">
              Até 2.5 pts / US$
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Valorizados a mercado
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Plane className="w-4 h-4 text-blue-600" />
              <span>Milhas Aéreas</span>
            </div>
            <div className="text-xl font-black text-slate-900">
              Programas Ativos
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Livelo, Esfera, Smiles
            </span>
          </div>

        </div>
      </div>

      {/* Meus Cartões & Programas Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Meus Cartões & Programas</h2>
          <span className="text-xs text-slate-500 font-medium">
            {activeCardsCount} ativos para cálculo de ofertas
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {userCards.map((card) => (
            <div
              key={card.id}
              className={`p-5 rounded-2xl border transition-all ${
                card.active
                  ? 'bg-white border-slate-200 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{card.name}</h3>
                      <p className="text-xs text-slate-500">{card.bank} • {card.tier} ({card.brand})</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    {card.pointsPerUsd > 0 && (
                      <div className="text-slate-700">
                        Pontuação: <strong className="text-blue-600 font-bold">{card.pointsPerUsd} pts / US$</strong>
                      </div>
                    )}
                    {card.cashbackRate > 0 && (
                      <div className="text-slate-700">
                        Cashback: <strong className="text-emerald-700 font-bold">{card.cashbackRate}%</strong>
                      </div>
                    )}
                  </div>

                  {card.specialBenefits && card.specialBenefits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {card.specialBenefits.map((b, i) => (
                        <span key={i} className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-100">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <button
                    onClick={() => toggleCardActive(card.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 cursor-pointer"
                  >
                    <span>{card.active ? 'Ativo no Cálculo' : 'Pausado'}</span>
                    {card.active ? (
                      <ToggleRight className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-400" />
                    )}
                  </button>
                  <span className="text-[10px] text-slate-400">Regra de benefícios</span>
                </div>

              </div>
            </div>
          ))}

          {/* Add card placeholder button */}
          <button
            onClick={() => setIsAddCardModalOpen(true)}
            className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex flex-col items-center justify-center gap-2 group text-slate-500 hover:text-blue-600 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Adicionar Cartão ou Programa de Fidelidade</span>
          </button>
        </div>
      </div>

    </div>
  );
};
