import React from 'react';
import { Offer, Product } from '../types';
import { useApp } from '../context/AppContext';
import { calculateEffectivePrice } from '../utils/effectivePriceCalculator';
import { formatCurrency } from '../utils/formatters';
import { ExternalLink, HelpCircle, Trophy, Sparkles, Check, Truck } from 'lucide-react';

interface OfferRankingCardProps {
  product: Product;
  offers: Offer[];
}

export const OfferRankingCard: React.FC<OfferRankingCardProps> = ({ product, offers }) => {
  const { userCards, userPrograms, openCalculationModal } = useApp();

  // Calculate effective price for each offer and rank by lowest totalEffectiveCost
  const evaluatedOffers = offers.map(offer => ({
    offer,
    breakdown: calculateEffectivePrice(offer, userCards, userPrograms)
  })).sort((a, b) => a.breakdown.totalEffectiveCost - b.breakdown.totalEffectiveCost);

  if (evaluatedOffers.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Ranking Inteligente de Lojas
          </h2>
          <p className="text-xs text-slate-500">
            Ofertas ordenadas pelo menor custo efetivo considerando seus cartões e benefícios cadastrados.
          </p>
        </div>
      </div>

      {/* Ranked List */}
      <div className="space-y-3">
        {evaluatedOffers.map((item, index) => {
          const isWinner = index === 0;
          const { offer, breakdown } = item;

          return (
            <div
              key={offer.id}
              className={`p-5 rounded-2xl transition-all relative ${
                isWinner
                  ? 'bg-white border-2 border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                  : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              {isWinner && (
                <div className="absolute -top-3 right-6 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-200" /> 1º Lugar • Melhor Escolha
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Store & Perks */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      isWinner ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {index + 1}º
                    </span>
                    <span className="font-bold text-slate-900 text-base">{offer.store.name}</span>
                    {offer.store.trustedBadge && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded">
                        Loja Oficial
                      </span>
                    )}
                  </div>

                  {/* Benefit reasoning badge */}
                  <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{breakdown.bestReason}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      {offer.isFreeShipping ? (
                        <strong className="text-emerald-700 font-bold">Frete Grátis</strong>
                      ) : (
                        `Frete: ${formatCurrency(offer.shippingPrice)}`
                      )}
                    </span>
                    <span>•</span>
                    <span>Entrega estimada: <strong>{offer.estimatedDeliveryDays} {offer.estimatedDeliveryDays === 1 ? 'dia útil' : 'dias úteis'}</strong></span>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="text-xs text-slate-400">
                      Preço Loja: <span className="font-semibold text-slate-700">{formatCurrency(offer.currentPrice)}</span>
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                      Custo Efetivo
                    </div>
                    <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                      {formatCurrency(breakdown.totalEffectiveCost)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 min-w-[120px]">
                    <a
                      href={offer.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                        isWinner
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
                      }`}
                    >
                      <span>Ir para Loja</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => openCalculationModal(offer)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 py-0.5"
                    >
                      <HelpCircle className="w-3 h-3" /> Ver cálculo
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
