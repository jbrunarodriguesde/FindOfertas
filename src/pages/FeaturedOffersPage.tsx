import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { Sparkles, Flame, Tag, Filter } from 'lucide-react';

export const FeaturedOffersPage: React.FC = () => {
  const hotProducts = MOCK_PRODUCTS.filter(p => p.isHot || p.priceChangePct < 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full mb-1">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Radar de Ofertas do Dia</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Ofertas em Destaque</h1>
          <p className="text-xs text-slate-500">
            Produtos com as maiores reduções de preço e multiplicadores especiais de pontos e cashback.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotProducts.map((product, idx) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isBestOption={idx === 0} 
          />
        ))}
      </div>

    </div>
  );
};
