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
  login: (email: string, name?: string, avatar?: string, authProvider?: 'google' | 'email') => void;
  register: (name: string, email: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  redirectAfterLogin: PageRoute | null;
  setRedirectAfterLogin: (page: PageRoute | null) => void;
  requireAuth: (targetPage: PageRoute, callback?: () => void) => boolean;
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

const AUTH_STORAGE_KEY = 'findofertas_auth_session';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-iphone-15');
  const [userCards, setUserCards] = useState<UserCard[]>(MOCK_USER_CARDS);
  const [userPrograms] = useState<LoyaltyProgram[]>(MOCK_LOYALTY_PROGRAMS);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<PageRoute | null>(null);

  // Initialize Auth state from localStorage or default
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading auth session:', e);
    }
    return INITIAL_USER_PROFILE;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? true : true; // Default true for frictionless initial explore, but fully capable of logout/login
    } catch (e) {
      return true;
    }
  });

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

  const login = (
    email: string, 
    name: string = 'Bruna', 
    avatar?: string, 
    authProvider: 'google' | 'email' = 'email'
  ) => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      name: name.trim() || 'Usuário FindOfertas',
      email: email.trim(),
      avatar: avatar || userProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      authProvider,
      joinedAt: userProfile.joinedAt || 'Hoje'
    };

    setIsLoggedIn(true);
    setUserProfile(updatedProfile);

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Failed to persist auth session:', e);
    }

    showToast(`Bem-vindo(a) de volta, ${updatedProfile.name.split(' ')[0]}!`, 'success');
    
    if (redirectAfterLogin) {
      const dest = redirectAfterLogin;
      setRedirectAfterLogin(null);
      navigate(dest);
    } else {
      navigate('dashboard');
    }
  };

  const register = (name: string, email: string) => {
    const newProfile: UserProfile = {
      ...INITIAL_USER_PROFILE,
      name: name.trim() || 'Novo Usuário',
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      authProvider: 'email',
      joinedAt: 'Hoje',
      totalCashbackBalance: 0,
      totalPointsBalance: 0,
      totalMilesBalance: 0,
      estimatedSavings: 0
    };

    setIsLoggedIn(true);
    setUserProfile(newProfile);

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Failed to persist auth session:', e);
    }

    showToast(`Conta criada com sucesso! Bem-vindo(a) ao FindOfertas, ${name.split(' ')[0]}!`, 'success');
    
    if (redirectAfterLogin) {
      const dest = redirectAfterLogin;
      setRedirectAfterLogin(null);
      navigate(dest);
    } else {
      navigate('wallet');
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate real Google OAuth popup / Token Client interaction
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      // If client ID is present, we log that it's configured
      if (googleClientId) {
        console.log('Google Client ID detectado:', googleClientId);
      }

      // Perform real or simulated user sign in with Google details
      setTimeout(() => {
        const googleUser = {
          name: 'Bruna Rodrigues',
          email: 'bruna.rodrigues@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          authProvider: 'google' as const
        };

        login(googleUser.email, googleUser.name, googleUser.avatar, googleUser.authProvider);
        resolve();
      }, 600);
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth session:', e);
    }
    showToast('Você saiu da sua conta com segurança.', 'info');
    navigate('home');
  };

  const requireAuth = (targetPage: PageRoute, callback?: () => void): boolean => {
    if (!isLoggedIn) {
      setRedirectAfterLogin(targetPage);
      showToast('Faça login para acessar esta área exclusiva.', 'info');
      navigate('login');
      return false;
    }
    if (callback) callback();
    return true;
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
        register,
        loginWithGoogle,
        logout,
        redirectAfterLogin,
        setRedirectAfterLogin,
        requireAuth,
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
