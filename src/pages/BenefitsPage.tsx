import React from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_BENEFITS_PROMOTIONS } from '../data/mockBenefits';
import { formatCurrency, formatCompactNumber } from '../utils/formatters';
import { Sparkles, Gift, ArrowUpRight, Clock, ExternalLink, ShieldCheck, Tag } from 'lucide-react';

export const BenefitsPage: React.FC = () => {
  const { userProfile, navigate } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Meus Benefícios & Promoções</h1>
        <p className="text-xs text-slate-500">
          Oportunidades ativas para turbinar seus pontos, milhas e economizar em lojas parceiras.
        </p>
      </div>

      {/* Top Balances Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Cashback Disponível
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {formatCurrency(userProfile.totalCashbackBalance)}
          </div>
          <span className="text-[11px] text-slate-500">Pronto para resgate</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Pontos de Fidelidade
          </span>
          <div className="text-2xl font-black text-[#003ec7] mt-1">
            {formatCompactNumber(userProfile.totalPointsBalance)} pts
          </div>
          <span className="text-[11px] text-slate-500">Livelo + Esfera</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Milhas Acumuladas
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatCompactNumber(userProfile.totalMilesBalance)} milhas
          </div>
          <span className="text-[11px] text-slate-500">Smiles + LATAM Pass</span>
        </div>
      </div>

      {/* Active Promotions Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#003ec7]" />
            Promoções & Bônus em Destaque
          </h2>
          <span className="text-xs text-slate-400">Atualizado hoje</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_BENEFITS_PROMOTIONS.map((promo) => (
            <div
              key={promo.id}
              className="bg-white border border-slate-200/90 hover:border-[#003ec7]/40 rounded-3xl p-6 transition-all hover:shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-blue-50 text-[#003ec7] font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200/60">
                    {promo.badge}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {promo.expiresAt}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {promo.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {promo.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500">
                  Parceiro: <strong className="text-slate-800">{promo.partner}</strong>
                </div>

                <button
                  onClick={() => navigate('search')}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>Ver Ofertas</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
