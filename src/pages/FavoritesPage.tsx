import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { Heart, Search, ArrowRight } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favoriteProductIds, navigate } = useApp();

  const favoriteProducts = MOCK_PRODUCTS.filter(p => favoriteProductIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Meus Produtos Favoritos</h1>
        <p className="text-xs text-slate-500">
          Acompanhe seus produtos salvos e o custo efetivo atual de cada um.
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Nenhum favorito salvo ainda</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Clique no ícone de coração nos produtos para acompanhar preços e descontos com facilidade.
          </p>
          <button
            onClick={() => navigate('search')}
            className="inline-flex items-center gap-1.5 bg-[#003ec7] hover:bg-[#0030a0] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Explorar Produtos</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
