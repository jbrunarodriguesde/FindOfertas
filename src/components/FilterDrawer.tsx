import React from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_STORES } from '../data/mockStores';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resultCount?: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose, resultCount }) => {
  const { filters, setFilters, resetFilters } = useApp();

  const toggleStore = (storeName: string) => {
    setFilters(prev => {
      const exists = prev.selectedStores.includes(storeName);
      return {
        ...prev,
        selectedStores: exists
          ? prev.selectedStores.filter(s => s !== storeName)
          : [...prev.selectedStores, storeName]
      };
    });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Drawer / Sidebar container */}
      <aside 
        className={`bg-white border border-slate-200 rounded-2xl p-5 space-y-6 text-xs transition-all duration-200 shadow-sm ${
          isOpen
            ? 'fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl shadow-2xl md:static md:max-h-none md:rounded-2xl md:shadow-none'
            : 'hidden md:block'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Filtros de Busca</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Limpar
            </button>
            <button
              onClick={onClose}
              className="md:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stores Filter */}
        <div className="space-y-2.5">
          <label className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
            Lojas Parceiras
          </label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {MOCK_STORES.map((store) => {
              const checked = filters.selectedStores.includes(store.name);
              return (
                <label 
                  key={store.id} 
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleStore(store.name)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="font-medium text-xs">{store.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">★ {store.rating}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Special Perks Toggles */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <label className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
            Benefícios & Vantagens
          </label>
          
          <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.onlyFreeShipping}
              onChange={(e) => setFilters(prev => ({ ...prev, onlyFreeShipping: e.target.checked }))}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span className="font-medium text-xs text-slate-700">Apenas Frete Grátis</span>
          </label>

          <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.onlyWithCashback}
              onChange={(e) => setFilters(prev => ({ ...prev, onlyWithCashback: e.target.checked }))}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span className="font-medium text-xs text-slate-700">Com Cashback Ativo</span>
          </label>

          <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.onlyWithPoints}
              onChange={(e) => setFilters(prev => ({ ...prev, onlyWithPoints: e.target.checked }))}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span className="font-medium text-xs text-slate-700">Com Acúmulo de Pontos</span>
          </label>
        </div>

        {/* Sorting selector inside sidebar */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <label className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
            Ordenar Por
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
          >
            <option value="best_for_you">Melhor para você (Recomendado)</option>
            <option value="lowest_effective">Menor custo efetivo</option>
            <option value="lowest_price">Menor preço anunciado</option>
            <option value="highest_cashback">Maior cashback</option>
            <option value="most_points">Mais pontos acumulados</option>
          </select>
        </div>

        {/* Mobile apply button */}
        <div className="md:hidden pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-200"
          >
            Ver {resultCount || 'ofertas'}
          </button>
        </div>

      </aside>
    </>
  );
};
