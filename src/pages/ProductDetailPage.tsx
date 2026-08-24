import React from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_OFFERS } from '../data/mockOffers';
import { PriceHistoryChart } from '../components/PriceHistoryChart';
import { OfferRankingCard } from '../components/OfferRankingCard';
import { calculateEffectivePrice } from '../utils/effectivePriceCalculator';
import { formatCurrency } from '../utils/formatters';
import { 
  Star, 
  Heart, 
  Bell, 
  ShieldCheck, 
  ChevronLeft, 
  Share2, 
  ExternalLink,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    navigate, 
    toggleFavorite, 
    isFavorite, 
    openAddAlertModal,
    openCalculationModal,
    userCards,
    userPrograms,
    showToast
  } = useApp();

  const product = MOCK_PRODUCTS.find(p => p.id === selectedProductId) || MOCK_PRODUCTS[0];
  const offers = MOCK_OFFERS.filter(o => o.productId === product.id);
  const isFav = isFavorite(product.id);

  // Best offer
  const evaluatedOffers = offers.map(offer => ({
    offer,
    breakdown: calculateEffectivePrice(offer, userCards, userPrograms)
  })).sort((a, b) => a.breakdown.totalEffectiveCost - b.breakdown.totalEffectiveCost);

  const bestOption = evaluatedOffers[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link da oferta copiado!', 'success');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Back button and quick actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('search')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para resultados</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs"
            title="Compartilhar oferta"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`p-2 rounded-xl border transition-all shadow-2xs ${
              isFav 
                ? 'bg-rose-50 border-rose-200 text-rose-500' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-500'
            }`}
            title="Salvar nos favoritos"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => openAddAlertModal(product)}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-white border border-slate-200 hover:border-blue-500 text-slate-800 hover:text-blue-600 px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
          >
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Criar Alerta</span>
          </button>
        </div>
      </div>

      {/* Main Product Showcase Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm">
        
        {/* Product Image Area */}
        <div className="md:col-span-5 flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-72 object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {product.isHot && (
            <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              Destaque
            </span>
          )}
        </div>

        {/* Product Specs & Main Price Snapshot */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
              <span className="text-slate-700 ml-1 font-black">({product.rating})</span>
            </div>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500">{product.reviewsCount} avaliações verificadas</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {product.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quick specs pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {product.specs.slice(0, 3).map((spec, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-bold border border-slate-200/60">
                <span className="text-slate-500 font-normal">{spec.label}: </span>{spec.value}
              </span>
            ))}
          </div>

          {/* Best Deal Mini Box */}
          {bestOption && (
            <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500 shadow-md flex items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-bl-lg">
                Melhor Oferta
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Menor Custo Efetivo
                </span>
                <div className="text-2xl font-black text-slate-900">
                  {formatCurrency(bestOption.breakdown.totalEffectiveCost)}
                </div>
                <span className="text-[11px] text-slate-500">
                  Na loja <strong className="text-blue-600">{bestOption.offer.store.name}</strong> com benefícios ativos
                </span>
              </div>

              <a
                href={bestOption.offer.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-blue-200 flex items-center gap-1.5 transition-all flex-shrink-0 active:scale-95"
              >
                <span>Ir para Loja</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

      </div>

      {/* Price History Section */}
      <PriceHistoryChart productId={product.id} basePrice={product.basePrice} />

      {/* Store Comparison Ranking Section */}
      <OfferRankingCard product={product} offers={offers} />

      {/* Specs Detail Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900">Especificações Técnicas Completas</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {product.specs.map((spec, i) => (
            <div key={i} className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-medium">{spec.label}</span>
              <span className="text-slate-900 font-semibold text-right">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
