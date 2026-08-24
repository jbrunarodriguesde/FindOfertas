import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { FilterDrawer } from '../components/FilterDrawer';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_OFFERS } from '../data/mockOffers';
import { calculateEffectivePrice } from '../utils/effectivePriceCalculator';
import { formatCurrency } from '../utils/formatters';
import { SlidersHorizontal, ArrowUpDown, Sparkles, ExternalLink, HelpCircle, ShieldCheck } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const { 
    searchQuery, 
    filters, 
    setFilters, 
    userCards, 
    userPrograms, 
    navigate,
    openCalculationModal 
  } = useApp();
  
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter products by search query
  const queryClean = searchQuery.toLowerCase().trim();
  const matchedProducts = MOCK_PRODUCTS.filter(p => {
    if (!queryClean) return true;
    return (
      p.name.toLowerCase().includes(queryClean) ||
      p.brand.toLowerCase().includes(queryClean) ||
      p.model.toLowerCase().includes(queryClean) ||
      p.category.toLowerCase().includes(queryClean)
    );
  });

  // Extract all offers matching matched products
  const matchedProductIds = matchedProducts.map(p => p.id);
  let relevantOffers = MOCK_OFFERS.filter(o => matchedProductIds.includes(o.productId));

  // Apply filters
  if (filters.selectedStores.length > 0) {
    relevantOffers = relevantOffers.filter(o => filters.selectedStores.includes(o.store.name));
  }
  if (filters.onlyFreeShipping) {
    relevantOffers = relevantOffers.filter(o => o.isFreeShipping);
  }
  if (filters.onlyWithCashback) {
    relevantOffers = relevantOffers.filter(o => o.cashbackRate > 0);
  }
  if (filters.onlyWithPoints) {
    relevantOffers = relevantOffers.filter(o => o.pointsMultiplier > 0);
  }

  // Calculate effective price for each offer
  const evaluatedOffers = relevantOffers.map(offer => {
    const product = MOCK_PRODUCTS.find(p => p.id === offer.productId) || MOCK_PRODUCTS[0];
    const breakdown = calculateEffectivePrice(offer, userCards, userPrograms);
    return {
      offer,
      product,
      breakdown
    };
  });

  // Sort offers
  evaluatedOffers.sort((a, b) => {
    if (filters.sortBy === 'lowest_effective') {
      return a.breakdown.totalEffectiveCost - b.breakdown.totalEffectiveCost;
    }
    if (filters.sortBy === 'lowest_price') {
      return a.offer.currentPrice - b.offer.currentPrice;
    }
    if (filters.sortBy === 'highest_cashback') {
      return b.breakdown.cashbackAmount - a.breakdown.cashbackAmount;
    }
    if (filters.sortBy === 'most_points') {
      return b.breakdown.pointsEarned - a.breakdown.pointsEarned;
    }
    // Default 'best_for_you'
    return a.breakdown.totalEffectiveCost - b.breakdown.totalEffectiveCost;
  });

  const bestOfferItem = evaluatedOffers[0];
  const otherOffers = evaluatedOffers.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Search & Filter Bar */}
      <div className="space-y-4">
        <div className="max-w-3xl">
          <SearchBar variant="compact" placeholder="Buscar outro produto..." />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {searchQuery.trim() ? `Resultados para "${searchQuery}"` : 'Todas as Ofertas e Produtos'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Encontramos {evaluatedOffers.length} {evaluatedOffers.length === 1 ? 'oferta' : 'ofertas'}. Comparando preços, cashback e pontos.
            </p>
          </div>

          {/* Mobile Filter & Desktop Sort Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="md:hidden flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#003ec7]" />
              <span>Filtrar</span>
              {(filters.selectedStores.length > 0 || filters.onlyFreeShipping || filters.onlyWithCashback) && (
                <span className="w-2 h-2 rounded-full bg-[#003ec7]" />
              )}
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Ordenar:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#003ec7] outline-none"
              >
                <option value="best_for_you">Melhor para você</option>
                <option value="lowest_effective">Menor custo efetivo</option>
                <option value="lowest_price">Menor preço anunciado</option>
                <option value="highest_cashback">Maior cashback</option>
                <option value="most_points">Mais pontos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters (desktop) + Offer Results List */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <FilterDrawer 
            isOpen={isFilterDrawerOpen} 
            onClose={() => setIsFilterDrawerOpen(false)} 
            resultCount={evaluatedOffers.length}
          />
        </div>

        {/* Results Container */}
        <div className="md:col-span-3 space-y-6">
          
          {evaluatedOffers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl font-bold">
                🔍
              </div>
              <h3 className="text-lg font-bold text-slate-900">Nenhuma oferta encontrada</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Experimente pesquisar outro termo ou limpar os filtros aplicados para ver mais resultados.
              </p>
            </div>
          ) : (
            <>
              {/* Best Option Card Highlight (matching Professional Polish layout) */}
              {bestOfferItem && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Destaque: Melhor Escolha Para Você</span>
                  </div>

                  <div className="bg-white border-2 border-emerald-500 rounded-2xl p-4 sm:p-6 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                      MELHOR OPÇÃO
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 sm:pt-0">
                      
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full min-w-0 flex-1">
                        <img 
                          src={bestOfferItem.product.image} 
                          alt={bestOfferItem.product.name} 
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-slate-50 p-2 border border-slate-100 flex-shrink-0"
                        />
                        <div className="space-y-1 min-w-0 flex-1 pr-14 sm:pr-0">
                          <span className="text-[11px] sm:text-xs font-bold uppercase text-blue-600 tracking-wider block truncate">
                            {bestOfferItem.offer.store.name}
                          </span>
                          <h3 
                            onClick={() => navigate('product', bestOfferItem.product.id)}
                            className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer break-words"
                          >
                            {bestOfferItem.product.name}
                          </h3>
                          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                            <span className="whitespace-nowrap">Preço loja: <strong>{formatCurrency(bestOfferItem.offer.currentPrice)}</strong></span>
                            {bestOfferItem.breakdown.cashbackAmount > 0 && (
                              <span className="text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded text-[11px] whitespace-nowrap inline-flex items-center">
                                -{formatCurrency(bestOfferItem.breakdown.cashbackAmount)} ({bestOfferItem.offer.cashbackRate}% CB)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto flex items-center justify-between sm:flex-col sm:items-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <div className="sm:text-right">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                            Custo Efetivo
                          </span>
                          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            {formatCurrency(bestOfferItem.breakdown.totalEffectiveCost)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => openCalculationModal(bestOfferItem.offer)}
                            className="text-xs text-slate-400 hover:text-blue-600 p-2 cursor-pointer"
                            title="Ver cálculo transparente"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </button>
                          <a
                            href={bestOfferItem.offer.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md shadow-blue-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <span>Ir para Loja</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Other Offers Section */}
              {otherOffers.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Outras Ofertas Comparadas
                  </h3>

                  <div className="space-y-3">
                    {otherOffers.map(({ offer, product, breakdown }) => (
                      <div
                        key={offer.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                      >
                        <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 w-full min-w-0 flex-1">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-xl bg-slate-50 p-1.5 border border-slate-100 flex-shrink-0"
                          />
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                              {offer.store.name}
                            </span>
                            <h4 
                              onClick={() => navigate('product', product.id)}
                              className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer break-words"
                            >
                              {product.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-500 pt-1">
                              <span className="whitespace-nowrap">Loja: {formatCurrency(offer.currentPrice)}</span>
                              {breakdown.cashbackAmount > 0 && (
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] whitespace-nowrap inline-flex items-center">
                                  -{formatCurrency(breakdown.cashbackAmount)} ({offer.cashbackRate}% CB)
                                </span>
                              )}
                              {breakdown.pointsEarned > 0 && (
                                <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded text-[11px] whitespace-nowrap inline-flex items-center">
                                  +{breakdown.pointsEarned.toLocaleString('pt-BR')} pts
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="w-full sm:w-auto flex items-center justify-between sm:flex-col sm:items-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                          <div className="sm:text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Custo Efetivo
                            </span>
                            <div className="text-lg sm:text-xl font-black text-slate-900">
                              {formatCurrency(breakdown.totalEffectiveCost)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => openCalculationModal(offer)}
                              className="text-xs text-slate-400 hover:text-blue-600 p-2 cursor-pointer"
                              title="Ver cálculo"
                            >
                              <HelpCircle className="w-4 h-4" />
                            </button>
                            <a
                              href={offer.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                            >
                              <span>Ver</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </>
          )}

        </div>

      </div>

    </div>
  );
};
