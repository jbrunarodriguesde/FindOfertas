import React from 'react';
import { Product, Offer } from '../types';
import { useApp } from '../context/AppContext';
import { calculateEffectivePrice } from '../utils/effectivePriceCalculator';
import { formatCurrency } from '../utils/formatters';
import { Heart, Star, ShieldCheck, ArrowRight, Sparkles, TrendingDown, HelpCircle } from 'lucide-react';
import { MOCK_OFFERS } from '../data/mockOffers';

interface ProductCardProps {
  product: Product;
  featuredOffer?: Offer;
  isBestOption?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  featuredOffer,
  isBestOption = false
}) => {
  const { 
    navigate, 
    userCards, 
    userPrograms, 
    toggleFavorite, 
    isFavorite,
    openCalculationModal 
  } = useApp();

  // Find best offer for product or use provided
  const productOffers = MOCK_OFFERS.filter(o => o.productId === product.id);
  const bestOffer = featuredOffer || productOffers[0] || {
    id: `temp-${product.id}`,
    productId: product.id,
    storeId: 'store-amazon',
    store: { id: 'store-amazon', name: 'Amazon Brasil', logo: '', rating: 4.9, trustedBadge: true, website: '' },
    originalPrice: product.oldPrice || product.basePrice * 1.1,
    currentPrice: product.basePrice,
    shippingPrice: 0,
    isFreeShipping: true,
    discountPixPct: 5,
    cashbackRate: 3.5,
    cashbackProgram: 'Compara+',
    pointsMultiplier: 2.0,
    loyaltyProgram: 'Livelo',
    estimatedDeliveryDays: 2,
    affiliateUrl: '#',
    inStock: true,
    condition: 'novo' as const
  };

  const effective = calculateEffectivePrice(bestOffer, userCards, userPrograms);
  const isFav = isFavorite(product.id);

  return (
    <article 
      className={`bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between transition-all duration-200 relative group ${
        isBestOption
          ? 'border-2 border-emerald-500 overflow-hidden'
          : 'border border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Banner if Best Option */}
      {isBestOption && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-tighter shadow-xs flex items-center gap-1 z-10">
          <Sparkles className="w-3 h-3" /> Melhor Escolha
        </div>
      )}

      {/* Top Meta: Store name & Favorite button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            {bestOffer.store.name}
          </span>
          {bestOffer.store.trustedBadge && (
            <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
              <ShieldCheck className="w-2.5 h-2.5" /> Oficial
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`p-1.5 rounded-full transition-all ${
            isFav 
              ? 'text-rose-500 bg-rose-50' 
              : 'text-slate-300 hover:text-rose-500 hover:bg-slate-50'
          }`}
          aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image and OFF tag */}
      <div 
        onClick={() => navigate('product', product.id)}
        className="w-full h-40 bg-slate-50 rounded-xl mb-4 p-3 flex items-center justify-center cursor-pointer overflow-hidden relative border border-slate-100/80"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.priceChangePct < 0 && (
          <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5">
            <TrendingDown className="w-3 h-3" />
            {Math.abs(product.priceChangePct)}% OFF
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 
            onClick={() => navigate('product', product.id)}
            className="font-bold text-slate-800 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer text-sm"
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold flex-shrink-0">
            <Star className="w-3 h-3 fill-current" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Display Price Line */}
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-xs text-slate-400">
            {bestOffer.originalPrice > bestOffer.currentPrice && (
              <span className="line-through mr-1.5">{formatCurrency(bestOffer.originalPrice)}</span>
            )}
            <span>Loja</span>
          </div>
          <div className="text-lg font-black text-slate-900">
            {formatCurrency(bestOffer.currentPrice)}
          </div>
        </div>

        {/* 4-Metric Grid Breakdown (matching Professional Polish layout) */}
        <div className="grid grid-cols-4 gap-2 mt-auto border-t border-slate-100 pt-3 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Frete</div>
            <div className="text-xs font-bold text-emerald-600 truncate">
              {bestOffer.isFreeShipping ? 'Grátis' : formatCurrency(bestOffer.shippingPrice)}
            </div>
          </div>

          <div className="border-l border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Cashback</div>
            <div className="text-xs font-bold text-blue-600 truncate">
              {effective.cashbackAmount > 0 ? formatCurrency(effective.cashbackAmount) : 'R$ 0,00'}
            </div>
          </div>

          <div className="border-l border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Pontos</div>
            <div className="text-xs font-bold text-slate-600 truncate">
              {effective.pointsEarned > 0 ? `+${effective.pointsEarned} pt` : '0 pt'}
            </div>
          </div>

          <div 
            onClick={(e) => {
              e.stopPropagation();
              openCalculationModal(bestOffer);
            }}
            className="bg-emerald-50 rounded-lg py-1 px-1.5 cursor-pointer hover:bg-emerald-100 transition-colors"
            title="Ver demonstrativo de cálculo"
          >
            <div className="text-[9px] text-emerald-700 font-bold uppercase truncate">Custo Efetivo</div>
            <div className="text-xs font-black text-emerald-800 truncate">
              {formatCurrency(effective.totalEffectiveCost)}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
        <button
          onClick={() => navigate('product', product.id)}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl transition-colors text-center"
        >
          {productOffers.length} {productOffers.length === 1 ? 'oferta' : 'ofertas'}
        </button>

        <button
          onClick={() => navigate('product', product.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-1"
        >
          <span>Comparar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
