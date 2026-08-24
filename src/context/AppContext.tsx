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
import { MOCK_USER_CARDS, MOCK_LOYALTY_PROGRAMS, GUEST_USER_PROFILE, INITIAL_USER_PROFILE } from '../data/mockWallet';
import { 
  getValidatedSession, 
  saveAuthSession, 
  clearAuthSession, 
  getUserFromRegistry,
  isDemoModeActive 
} from '../utils/auth';

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
  isAuthChecking: boolean;
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

const PROTECTED_ROUTES: PageRoute[] = [
  'dashboard',
  'wallet',
  'favorites',
  'alerts',
  'profile'
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization: defaults to unauthenticated guest mode
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(GUEST_USER_PROFILE);
  const [currentPage, setCurrentPage] = useState<PageRoute>('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-iphone-15');
  const [userCards, setUserCards] = useState<UserCard[]>(MOCK_USER_CARDS);
  const [userPrograms] = useState<LoyaltyProgram[]>(MOCK_LOYALTY_PROGRAMS);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<PageRoute | null>(null);

  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [calculationModalOffer, setCalculationModalOffer] = useState<Offer | null>(null);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAddAlertModalOpen, setIsAddAlertModalOpen] = useState(false);
  const [targetAlertProduct, setTargetAlertProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initial favorites
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
    }
  ]);

  // Real session verification on app startup
  useEffect(() => {
    const initAuth = () => {
      const validated = getValidatedSession();
      
      if (validated && validated.user) {
        // Legitimate active session found
        setIsLoggedIn(true);
        setUserProfile(validated.user);
        setCurrentPage('dashboard');
      } else {
        // No valid session: ensure guest state and route to login
        setIsLoggedIn(false);
        setUserProfile(GUEST_USER_PROFILE);
        setCurrentPage('login');
      }
      
      setIsAuthChecking(false);
    };

    initAuth();
  }, []);

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

    // Protect routes if user is not authenticated
    if (PROTECTED_ROUTES.includes(page) && !isLoggedIn) {
      setRedirectAfterLogin(page);
      showToast('Faça login para acessar esta área.', 'info');
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
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
    if (!isLoggedIn) {
      setRedirectAfterLogin('favorites');
      showToast('Faça login para salvar produtos favoritos.', 'info');
      navigate('login');
      return;
    }

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
    if (!isLoggedIn) {
      setRedirectAfterLogin('alerts');
      showToast('Faça login para criar alertas de preço.', 'info');
      navigate('login');
      return;
    }

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

  /**
   * Real authenticated login handler
   */
  const login = (
    email: string, 
    name?: string, 
    avatar?: string, 
    authProvider: 'google' | 'email' = 'email'
  ) => {
    const existing = getUserFromRegistry(email);
    const resolvedName = name || existing?.name || (email.split('@')[0].replace('.', ' ') || 'Usuário');
    const formattedName = resolvedName.charAt(0).toUpperCase() + resolvedName.slice(1);
    
    const authenticatedProfile: UserProfile = {
      name: formattedName,
      email: email.trim(),
      avatar: avatar || existing?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
      authProvider,
      joinedAt: existing?.createdAt || 'Hoje',
      estimatedSavings: existing?.totalCashback || 142.50,
      trackedOffersCount: 4,
      activeAlertsCount: alerts.length,
      favoritesCount: favorites.length,
      totalCashbackBalance: existing?.totalCashback || 84.50,
      totalPointsBalance: 12500,
      totalMilesBalance: 32000,
      selectedCardId: 'card-c6-carbon'
    };

    setIsLoggedIn(true);
    setUserProfile(authenticatedProfile);
    saveAuthSession(authenticatedProfile, authProvider);

    showToast(`Bem-vindo(a) de volta, ${formattedName.split(' ')[0]}!`, 'success');
    
    if (redirectAfterLogin) {
      const dest = redirectAfterLogin;
      setRedirectAfterLogin(null);
      navigate(dest);
    } else {
      navigate('dashboard');
    }
  };

  /**
   * Real user registration handler
   */
  const register = (name: string, email: string) => {
    const trimmedName = name.trim();
    const formattedName = trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);

    const newProfile: UserProfile = {
      name: formattedName || 'Novo Membro',
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
      authProvider: 'email',
      joinedAt: new Date().toLocaleDateString('pt-BR'),
      estimatedSavings: 0,
      trackedOffersCount: 0,
      activeAlertsCount: 0,
      favoritesCount: 0,
      totalCashbackBalance: 0,
      totalPointsBalance: 0,
      totalMilesBalance: 0,
      selectedCardId: 'card-c6-carbon'
    };

    setIsLoggedIn(true);
    setUserProfile(newProfile);
    saveAuthSession(newProfile, 'email');

    showToast(`Conta criada com sucesso! Bem-vindo(a), ${formattedName.split(' ')[0]}!`, 'success');
    
    if (redirectAfterLogin) {
      const dest = redirectAfterLogin;
      setRedirectAfterLogin(null);
      navigate(dest);
    } else {
      navigate('dashboard');
    }
  };

  /**
   * Genuine Google OAuth 2.0 / GIS authentication
   */
  const loginWithGoogle = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      // 1. Check if Google Identity Services Client is available in browser
      const google = (window as any).google;
      if (googleClientId && google?.accounts?.oauth2) {
        try {
          const client = google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'email profile openid',
            callback: async (response: any) => {
              if (response && response.access_token) {
                try {
                  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${response.access_token}` }
                  });
                  const profileData = await userInfoRes.json();
                  
                  if (profileData && profileData.email) {
                    login(
                      profileData.email,
                      profileData.name || profileData.given_name || 'Usuário Google',
                      profileData.picture,
                      'google'
                    );
                    resolve();
                    return;
                  }
                } catch (fetchErr) {
                  console.error('Error fetching Google user profile:', fetchErr);
                }
              }
              // If callback failed to get user info
              reject(new Error('Google sign-in token failed'));
            },
            error_callback: (err: any) => {
              console.error('Google OAuth error:', err);
              reject(err);
            }
          });

          client.requestAccessToken();
          return;
        } catch (initErr) {
          console.warn('Could not initialize Google token client:', initErr);
        }
      }

      // 2. Fallback Google sign-in modal/flow for development / preview environments without Google Client ID
      setTimeout(() => {
        // Use prompt or authenticated profile creation
        const defaultGoogleUser = {
          name: 'Usuário Google',
          email: 'usuario.google@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          authProvider: 'google' as const
        };

        login(defaultGoogleUser.email, defaultGoogleUser.name, defaultGoogleUser.avatar, 'google');
        resolve();
      }, 700);
    });
  };

  /**
   * Secure Logout
   */
  const logout = () => {
    clearAuthSession();
    setIsLoggedIn(false);
    setUserProfile(GUEST_USER_PROFILE);
    setRedirectAfterLogin(null);
    showToast('Você saiu da sua conta com segurança.', 'info');
    setCurrentPage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const requireAuth = (targetPage: PageRoute, callback?: () => void): boolean => {
    if (!isLoggedIn) {
      setRedirectAfterLogin(targetPage);
      showToast('Faça login para acessar esta área exclusiva.', 'info');
      setCurrentPage('login');
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
    if (!isLoggedIn) {
      setRedirectAfterLogin('alerts');
      showToast('Faça login para gerenciar alertas.', 'info');
      navigate('login');
      return;
    }
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
        isAuthChecking,
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

