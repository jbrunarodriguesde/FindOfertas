import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockProducts';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  autoFocus?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  variant = 'hero', 
  autoFocus = false,
  placeholder = 'Digite um produto, marca ou modelo...'
}) => {
  const { searchQuery, setSearchQuery, navigate } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const popularSearches = [
    'iPhone 15',
    'Notebook',
    'Air Fryer',
    'Kindle',
    'Monitor Gamer',
    'Fone Bluetooth'
  ];

  // Suggestions based on query
  const suggestions = searchQuery.trim()
    ? MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    navigate('search');
  };

  const handleSelectSuggestion = (productId: string, productName: string) => {
    setSearchQuery(productName);
    setIsOpen(false);
    navigate('product', productId);
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchQuery(tag);
    setIsOpen(false);
    navigate('search');
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-full relative">
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-4 bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-200 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
        <div className="flex-1 flex items-center px-3 sm:px-4 gap-3">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            autoFocus={autoFocus}
            placeholder={placeholder}
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-200 flex items-center gap-1.5 transition-all active:scale-95 flex-shrink-0"
        >
          <span>Comparar</span>
          <ArrowRight className="w-4 h-4 hidden sm:inline" />
        </button>
      </form>

      {/* Autocomplete & Popular searches dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Direct product suggestions */}
          {suggestions.length > 0 ? (
            <div className="p-2 space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sugestões de Produtos
              </div>
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(product.id, product.name)}
                  className="w-full flex items-center justify-between p-2.5 hover:bg-blue-50/70 rounded-xl transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-1 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {product.category} • a partir de <strong className="text-slate-700">R$ {product.basePrice.toLocaleString('pt-BR')}</strong>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Ver ofertas <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              Nenhum produto correspondente direto. Pressione <strong>Comparar</strong> para pesquisar em todas as lojas.
            </div>
          ) : null}

          {/* Popular searches suggestions */}
          <div className="p-3 bg-slate-50/80 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Buscas populares:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="text-xs font-medium text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200/80 rounded-full px-3 py-1 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popular quick tags below Hero search */}
      {variant === 'hero' && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 px-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Popular:</span>
          {popularSearches.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTagClick(tag)}
              className="text-[11px] px-2.5 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded text-slate-600 cursor-pointer font-medium transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
