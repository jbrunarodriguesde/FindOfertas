import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { PriceHistoryChart } from '../components/PriceHistoryChart';
import { TrendingDown, Sparkles, Search } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const PriceHistoryPage: React.FC = () => {
  const { navigate } = useApp();
  const [selectedProduct, setSelectedProduct] = useState(MOCK_PRODUCTS[0]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900">Histórico de Preços em Massa</h1>
        <p className="text-xs text-slate-500">
          Analise o histórico e saiba se o momento atual é favorável para compra.
        </p>
      </div>

      {/* Select product quick pill bar */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
          Selecione o Produto para Analisar
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MOCK_PRODUCTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border flex-shrink-0 ${
                selectedProduct.id === p.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <img src={p.image} alt={p.name} className="w-5 h-5 object-contain rounded" />
              <span>{p.name.slice(0, 24)}...</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <PriceHistoryChart 
        productId={selectedProduct.id} 
        basePrice={selectedProduct.basePrice} 
      />

      {/* Product Summary Action */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <img 
            src={selectedProduct.image} 
            alt={selectedProduct.name} 
            className="w-16 h-16 object-contain rounded-xl bg-slate-50 p-2 border border-slate-100"
          />
          <div>
            <h3 className="text-sm font-bold text-slate-900">{selectedProduct.name}</h3>
            <p className="text-xs text-slate-500">
              Menor preço atual: <strong className="text-blue-600">{formatCurrency(selectedProduct.basePrice)}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('product', selectedProduct.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95"
        >
          Ver Todas as Ofertas deste Produto
        </button>
      </div>

    </div>
  );
};
