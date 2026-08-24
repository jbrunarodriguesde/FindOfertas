import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateEffectivePrice, DEFAULT_POINT_VALUE_PER_THOUSAND, DEFAULT_MILE_VALUE_PER_THOUSAND } from '../utils/effectivePriceCalculator';
import { formatCurrency } from '../utils/formatters';
import { 
  X, 
  Calculator, 
  Plus, 
  Minus, 
  Equal, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Info
} from 'lucide-react';

export const EffectivePriceModal: React.FC = () => {
  const { 
    calculationModalOffer, 
    closeCalculationModal, 
    userCards, 
    userPrograms, 
    activeProduct 
  } = useApp();

  const [simulatedCardId, setSimulatedCardId] = useState<string | undefined>(
    userCards.find(c => c.active)?.id || userCards[0]?.id
  );

  if (!calculationModalOffer) return null;

  const breakdown = calculateEffectivePrice(
    calculationModalOffer, 
    userCards, 
    userPrograms, 
    simulatedCardId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Cálculo do Custo Efetivo
              </h3>
              <p className="text-xs text-slate-500">
                Oferta na <strong className="text-slate-800">{calculationModalOffer.store.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={closeCalculationModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Product Summary banner */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <img 
              src={activeProduct.image} 
              alt={activeProduct.name}
              className="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-slate-200/60 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{activeProduct.name}</p>
              <p className="text-[11px] text-slate-500">
                Preço de tabela: <span className="line-through">{formatCurrency(calculationModalOffer.originalPrice)}</span>
              </p>
            </div>
          </div>

          {/* Interactive Card Simulator Switcher */}
          {userCards.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Simular com seus cartões cadastrados:</span>
              </label>
              <select
                value={simulatedCardId}
                onChange={(e) => setSimulatedCardId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none"
              >
                {userCards.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.name} • {card.pointsPerUsd > 0 ? `${card.pointsPerUsd} pts/US$` : ''} {card.cashbackRate > 0 ? `${card.cashbackRate}% CB` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Formula Line-by-Line Breakdown */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Demonstrativo Financeiro Transparente
            </div>

            {/* 1. Preço anunciado */}
            <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-200/60">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-black">1</span>
                <span className="font-medium">Preço Anunciado</span>
              </div>
              <span className="font-bold text-slate-900">{formatCurrency(breakdown.currentPrice)}</span>
            </div>

            {/* 2. Frete */}
            <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-200/60">
              <div className="flex items-center gap-2 text-slate-700">
                <Plus className="w-4 h-4 text-slate-400" />
                <span className="font-medium">Frete ({calculationModalOffer.isFreeShipping ? 'Grátis' : `${calculationModalOffer.estimatedDeliveryDays} dias`})</span>
              </div>
              <span className={`font-bold ${calculationModalOffer.isFreeShipping ? 'text-emerald-700' : 'text-slate-900'}`}>
                {calculationModalOffer.isFreeShipping ? 'R$ 0,00' : formatCurrency(breakdown.shippingPrice)}
              </span>
            </div>

            {/* 3. Desconto à vista / Cupom */}
            {breakdown.discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-200/60 text-emerald-700 bg-emerald-50 px-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Minus className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">{breakdown.discountLabel}</span>
                </div>
                <span className="font-bold">-{formatCurrency(breakdown.discountAmount)}</span>
              </div>
            )}

            {/* 4. Cashback */}
            {breakdown.cashbackAmount > 0 && (
              <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-200/60 text-emerald-700 bg-emerald-50 px-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Minus className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">{breakdown.cashbackLabel}</span>
                </div>
                <span className="font-bold">-{formatCurrency(breakdown.cashbackAmount)}</span>
              </div>
            )}

            {/* 5. Pontos convertidos */}
            {breakdown.pointsEarned > 0 && (
              <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-200/60 text-indigo-700 bg-indigo-50 px-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Minus className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">{breakdown.pointsLabel}</span>
                </div>
                <span className="font-bold">-{formatCurrency(breakdown.pointsValueReais)}</span>
              </div>
            )}

            {/* Final Custo Efetivo Row */}
            <div className="flex items-center justify-between text-base pt-3 border-t-2 border-emerald-500">
              <div className="flex items-center gap-2 text-emerald-800 font-black">
                <Equal className="w-5 h-5" />
                <span>CUSTO EFETIVO FINAL</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatCurrency(breakdown.totalEffectiveCost)}
              </div>
            </div>
          </div>

          {/* Educational Conversion Note */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-600">
              <Info className="w-3.5 h-3.5" />
              <span>Como precificamos pontos e milhas?</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Convertemos pontos considerando a cotação padrão de liquidez de mercado (R$ {DEFAULT_POINT_VALUE_PER_THOUSAND.toFixed(2)} a cada 1.000 pontos Livelo/Esfera e R$ {DEFAULT_MILE_VALUE_PER_THOUSAND.toFixed(2)} por 1.000 milhas).
            </p>
          </div>

        </div>

        {/* Modal Footer with Direct Link */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={closeCalculationModal}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 py-2.5 px-4 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Fechar
          </button>

          <a
            href={calculationModalOffer.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md shadow-blue-200 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>Ir para {calculationModalOffer.store.name}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
