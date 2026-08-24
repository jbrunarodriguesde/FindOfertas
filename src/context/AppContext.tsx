import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PageRoute, 
  Product, 
  Offer, 
  UserCard, 
  LoyaltyProgram, 
  FavoriteItem, 
  PriceAlert, 
  UserProfile, 
  FilterOptions 
} from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_USER_CARDS, MOCK_LOYALTY_PROGRAMS, INITIAL_USER_PROFILE } from '../data/mockWallet';
import { calculateEffectivePrice } from '../utils/effectivePriceCalculator';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentPage: PageRoute;
  navigate: (page: PageRoute, productId?: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  activeProduct: Product;
  userCards: UserCard[];
  toggleCardActive: (cardId: string) => void;
  addCard: (card: Omit<UserCard, 'id'>) => void;
  userPrograms: LoyaltyProgram[];
  favorites: FavoriteItem[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  alerts: PriceAlert[];
  addAlert: (productId: string, targetPrice: number) => void;
  toggleAlertActive: (alertId: string) => void;
  deleteAlert: (alertId: string) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  calculationModalOffer: Offer | null;
  openCalculationModal: (offer: Offer) => void;
  closeCalculationModal: () => void;
  isAddCardModalOpen: boolean;
  setIsAddCardModalOpen: (open: boolean) => void;
  isAddAlertModalOpen: boolean;
  setIsAddAlertModalOpen: (open: boolean) => void;
  targetAlertProduct: Product | null;
  openAddAlertModal: (product?: Product) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const DEFAULT_FILTERS: FilterOptions = {
  selectedStores: [],
  onlyFreeShipping: false,
  onlyWithCashback: false,
  onlyWithPoints: false,
  inStockOnly: true,
  sortBy: 'best_for_you'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-iphone-15');
  const [userCards, setUserCards] = useState<UserCard[]>(MOCK_USER_CARDS);
  const [userPrograms] = useState<LoyaltyProgram[]>(MOCK_LOYALTY_PROGRAMS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [calculationModalOffer, setCalculationModalOffer] = useState<Offer | null>(null);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAddAlertModalOpen, setIsAddAlertModalOpen] = useState(false);
  const [targetAlertProduct, setTargetAlertProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initial favorites matching design
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 'fav-1',
      productId: 'prod-phone-premium-zx',
      product: MOCK_PRODUCTS[1],
      addedAt: 'Há 2 dias',
      currentPrice: 4299,
      currentEffectivePrice: 3850,
      lowestPrice: 4199,
      priceChangePct: 5.2,
      alertActive: true,
      targetPrice: 3900
    },
    {
      id: 'fav-2',
      productId: 'prod-fone-sony-xm5',
      product: MOCK_PRODUCTS[2],
      addedAt: 'Há 5 dias',
      currentPrice: 1250,
      currentEffectivePrice: 1120,
      lowestPrice: 1199,
      priceChangePct: -12.5,
      alertActive: false
    },
    {
      id: 'fav-3',
      productId: 'prod-iphone-15',
      product: MOCK_PRODUCTS[0],
      addedAt: 'Hoje',
      currentPrice: 5299,
      currentEffectivePrice: 5035,
      lowestPrice: 4999,
      priceChangePct: -4.0,
      alertActive: true,
      targetPrice: 4800
    }
  ]);

  // Initial Alerts
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'alt-1',
      productId: 'prod-notebook-macbook-air',
      product: MOCK_PRODUCTS[4],
      targetEffectivePrice: 3000,
      currentEffectivePrice: 8650,
      currentPrice: 9499,
      active: true,
      createdAt: '18 Fev 2025',
      triggered: false,
      notifyEmail: true,
      notifyPush: true
    },
    {
      id: 'alt-2',
      productId: 'prod-iphone-15',
      product: MOCK_PRODUCTS[0],
      targetEffectivePrice: 4800,
      currentEffectivePrice: 5035,
      currentPrice: 5299,
      active: true,
      createdAt: '22 Fev 2025',
      triggered: false,
      notifyEmail: true,
      notifyPush: true
    }
  ]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigate = (page: PageRoute, productId?: string) => {
    if (productId) {
      setSelectedProductId(productId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCardActive = (cardId: string) => {
    setUserCards(prev => prev.map(c => c.id === cardId ? { ...c, active: !c.active } : c));
    showToast('Preferências de cartões atualizadas!', 'info');
  };

  const addCard = (newCardData: Omit<UserCard, 'id'>) => {
    const newCard: UserCard = {
      ...newCardData,
      id: `card-${Date.now()}`
    };
    setUserCards(prev => [newCard, ...prev]);
    showToast(`Cartão ${newCard.name} adicionado com sucesso!`, 'success');
  };

  const isFavorite = (productId: string) => {
    return favorites.some(f => f.productId === productId);
  };

  const toggleFavorite = (productId: string) => {
    const exists = favorites.some(f => f.productId === productId);
    if (exists) {
      setFavorites(prev => prev.filter(f => f.productId !== productId));
      setUserProfile(prev => ({ ...prev, favoritesCount: Math.max(0, prev.favoritesCount - 1) }));
      showToast('Produto removido dos favoritos', 'info');
    } else {
      const prod = MOCK_PRODUCTS.find(p => p.id === productId);
      if (prod) {
        const newFav: FavoriteItem = {
          id: `fav-${Date.now()}`,
          productId,
          product: prod,
          addedAt: 'Agora',
          currentPrice: prod.basePrice,
          currentEffectivePrice: Math.round(prod.basePrice * 0.94),
          lowestPrice: prod.lowestPrice30d,
          priceChangePct: prod.priceChangePct,
          alertActive: false
        };
        setFavorites(prev => [newFav, ...prev]);
        setUserProfile(prev => ({ ...prev, favoritesCount: prev.favoritesCount + 1 }));
        showToast('Produto adicionado aos favoritos!', 'success');
      }
    }
  };

  const addAlert = (productId: string, targetPrice: number) => {
    const prod = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
    const newAlert: PriceAlert = {
      id: `alt-${Date.now()}`,
      productId,
      product: prod,
      targetEffectivePrice: targetPrice,
      currentEffectivePrice: Math.round(prod.basePrice * 0.94),
      currentPrice: prod.basePrice,
      active: true,
      createdAt: 'Hoje',
      triggered: false,
      notifyEmail: true,
      notifyPush: true
    };
    setAlerts(prev => [newAlert, ...prev]);
    setUserProfile(prev => ({ ...prev, activeAlertsCount: prev.activeAlertsCount + 1 }));
    showToast(`Alerta ativado para ${prod.name} abaixo de R$ ${targetPrice.toLocaleString('pt-BR')}`, 'success');
  };

  const toggleAlertActive = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, active: !a.active } : a));
    showToast('Status do alerta atualizado', 'info');
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    setUserProfile(prev => ({ ...prev, activeAlertsCount: Math.max(0, prev.activeAlertsCount - 1) }));
    showToast('Alerta removido', 'info');
  };

  const login = (email: string, name: string = 'Bruna') => {
    setIsLoggedIn(true);
    setUserProfile({
      ...INITIAL_USER_PROFILE,
      name,
      email
    });
    showToast(`Bem-vinda de volta, ${name}!`, 'success');
    navigate('home');
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Você saiu da sua conta.', 'info');
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const openCalculationModal = (offer: Offer) => {
    setCalculationModalOffer(offer);
  };

  const closeCalculationModal = () => {
    setCalculationModalOffer(null);
  };

  const openAddAlertModal = (product?: Product) => {
    const target = product || MOCK_PRODUCTS.find(p => p.id === selectedProductId) || MOCK_PRODUCTS[0];
    setTargetAlertProduct(target);
    setIsAddAlertModalOpen(true);
  };

  const activeProduct = MOCK_PRODUCTS.find(p => p.id === selectedProductId) || MOCK_PRODUCTS[0];

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        searchQuery,
        setSearchQuery,
        selectedProductId,
        setSelectedProductId,
        activeProduct,
        userCards,
        toggleCardActive,
        addCard,
        userPrograms,
        favorites,
        toggleFavorite,
        isFavorite,
        alerts,
        addAlert,
        toggleAlertActive,
        deleteAlert,
        userProfile,
        setUserProfile,
        isLoggedIn,
        login,
        logout,
        filters,
        setFilters,
        resetFilters,
        calculationModalOffer,
        openCalculationModal,
        closeCalculationModal,
        isAddCardModalOpen,
        setIsAddCardModalOpen,
        isAddAlertModalOpen,
        setIsAddAlertModalOpen,
        targetAlertProduct,
        openAddAlertModal,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
