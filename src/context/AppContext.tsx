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
import { DEFAULT_USER_CARDS, MOCK_LOYALTY_PROGRAMS, GUEST_USER_PROFILE } from '../data/mockWallet';
import { supabase, supabaseService, isSupabaseConfigured } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

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
  searchHistory: string[];
  recordSearch: (query: string) => void;
  clearSearchHistory: () => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  activeProduct: Product;
  userCards: UserCard[];
  toggleCardActive: (cardId: string) => void;
  addCard: (card: Omit<UserCard, 'id'>) => void;
  userPrograms: LoyaltyProgram[];
  favorites: FavoriteItem[];
  favoriteProductIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  alerts: PriceAlert[];
  userAlerts: PriceAlert[];
  addAlert: (productId: string, targetPrice: number) => void;
  toggleAlertActive: (alertId: string) => void;
  deleteAlert: (alertId: string) => void;
  removeAlert: (alertId: string) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoggedIn: boolean;
  isAuthChecking: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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
  // Authentication & Session State (Starts 100% clean and unauthenticated)
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(GUEST_USER_PROFILE);
  const [currentPage, setCurrentPage] = useState<PageRoute>('login');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<PageRoute | null>(null);

  // App domain state (Starts strictly empty for every user)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-iphone-15');
  const [userCards, setUserCards] = useState<UserCard[]>(DEFAULT_USER_CARDS);
  const [userPrograms] = useState<LoyaltyProgram[]>(MOCK_LOYALTY_PROGRAMS);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  // UI Modals & Filters
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [calculationModalOffer, setCalculationModalOffer] = useState<Offer | null>(null);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAddAlertModalOpen, setIsAddAlertModalOpen] = useState(false);
  const [targetAlertProduct, setTargetAlertProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Helper for toasts
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  /**
   * Loads real user data from Supabase database tables for the authenticated user_id
   */
  const loadUserData = async (authUser: User) => {
    const uid = authUser.id;
    setCurrentUserId(uid);
    setIsLoggedIn(true);

    try {
      // 1. Fetch Profile
      let dbProfile = await supabaseService.getProfile(uid);
      const metaName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário';
      const metaAvatar = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(metaName)}`;

      if (!dbProfile) {
        // Automatic profile creation if not present yet
        dbProfile = await supabaseService.upsertProfile(uid, {
          name: metaName,
          email: authUser.email || '',
          avatarUrl: metaAvatar
        });
      }

      // 2. Fetch User Favorites (Isolated by user_id via RLS)
      const dbFavorites = await supabaseService.getFavorites(uid);
      const mappedFavorites: FavoriteItem[] = dbFavorites.map(f => {
        const prod = MOCK_PRODUCTS.find(p => p.id === f.product_id) || {
          id: f.product_id,
          name: f.product_name,
          brand: '',
          model: '',
          category: 'Geral',
          image: f.product_image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80',
          rating: 4.8,
          reviewsCount: 120,
          description: '',
          specs: [],
          basePrice: f.price || 0,
          priceChangePct: 0,
          lowestPrice30d: f.price || 0,
          highestPrice30d: f.price || 0,
          avgPrice30d: f.price || 0
        };

        return {
          id: f.id,
          productId: f.product_id,
          product: prod,
          addedAt: new Date(f.created_at).toLocaleDateString('pt-BR'),
          currentPrice: prod.basePrice,
          currentEffectivePrice: Math.round(prod.basePrice * 0.94),
          lowestPrice: prod.lowestPrice30d,
          priceChangePct: prod.priceChangePct,
          alertActive: false
        };
      });
      setFavorites(mappedFavorites);

      // 3. Fetch User Alerts (Isolated by user_id via RLS)
      const dbAlerts = await supabaseService.getAlerts(uid);
      const mappedAlerts: PriceAlert[] = dbAlerts.map(a => {
        const prod = MOCK_PRODUCTS.find(p => p.id === a.product_id) || {
          id: a.product_id,
          name: a.product_name,
          brand: '',
          model: '',
          category: 'Geral',
          image: a.product_image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80',
          rating: 4.8,
          reviewsCount: 120,
          description: '',
          specs: [],
          basePrice: a.current_price || a.target_price,
          priceChangePct: 0,
          lowestPrice30d: a.target_price,
          highestPrice30d: a.target_price * 1.2,
          avgPrice30d: a.target_price * 1.1
        };

        return {
          id: a.id,
          productId: a.product_id,
          product: prod,
          targetEffectivePrice: a.target_price,
          currentEffectivePrice: a.current_effective_price || prod.basePrice,
          currentPrice: a.current_price || prod.basePrice,
          active: a.active,
          createdAt: new Date(a.created_at).toLocaleDateString('pt-BR'),
          triggered: false,
          notifyEmail: a.notify_email,
          notifyPush: a.notify_push
        };
      });
      setAlerts(mappedAlerts);

      // 4. Fetch Search History
      const dbHistory = await supabaseService.getSearchHistory(uid);
      setSearchHistory(dbHistory);

      // 5. Fetch User Cards (Benefits calculation)
      const dbCards = await supabaseService.getUserCards(uid);
      if (dbCards && dbCards.length > 0) {
        setUserCards(dbCards.map(c => ({
          id: c.id,
          name: c.name,
          bank: c.bank,
          brand: (c.brand as any) || 'Mastercard',
          tier: (c.tier as any) || 'Black',
          program: 'Pontos & Milhas',
          pointsPerUsd: Number(c.points_per_usd) || 0,
          cashbackRate: Number(c.cashback_rate) || 0,
          annualFee: 0,
          colorTheme: c.brand === 'Visa'
            ? 'from-[#1e1e1e] to-[#0a0a0a] text-amber-400 border-zinc-700'
            : 'from-[#1e293b] to-[#0f172a] text-white border-slate-700',
          active: c.active,
          specialBenefits: ['Benefício Ativo']
        })));
      } else {
        setUserCards(DEFAULT_USER_CARDS);
      }

      // 6. Build App UserProfile
      const finalProfile: UserProfile = {
        name: dbProfile?.name || metaName,
        email: dbProfile?.email || authUser.email || '',
        avatar: dbProfile?.avatar_url || metaAvatar,
        authProvider: authUser.app_metadata?.provider === 'google' ? 'google' : 'email',
        joinedAt: new Date(authUser.created_at).toLocaleDateString('pt-BR'),
        estimatedSavings: 0,
        trackedOffersCount: 0,
        activeAlertsCount: mappedAlerts.length,
        favoritesCount: mappedFavorites.length,
        totalCashbackBalance: 0, // Informational benefits representation only
        totalPointsBalance: 0,
        totalMilesBalance: 0
      };

      setUserProfile(finalProfile);
    } catch (err) {
      console.error('Error synchronizing user data with Supabase:', err);
    }
  };

  /**
   * Resets local states to clean guest / unauthenticated state
   */
  const resetToCleanGuest = () => {
    setIsLoggedIn(false);
    setCurrentUserId(null);
    setUserProfile(GUEST_USER_PROFILE);
    setFavorites([]);
    setAlerts([]);
    setSearchHistory([]);
    setUserCards(DEFAULT_USER_CARDS);
  };

  // Real Supabase Auth listener
  useEffect(() => {
    let isMounted = true;

    const setupAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Supabase auth getSession error:', error.message);
        }

        if (session && session.user && isMounted) {
          await loadUserData(session.user);
          if (currentPage === 'login' || currentPage === 'register') {
            setCurrentPage('dashboard');
          }
        } else if (isMounted) {
          resetToCleanGuest();
          // If on a protected route without session, go to login
          if (PROTECTED_ROUTES.includes(currentPage)) {
            setCurrentPage('login');
          }
        }
      } catch (err) {
        console.warn('Error during Supabase auth setup:', err);
        if (isMounted) resetToCleanGuest();
      } finally {
        if (isMounted) setIsAuthChecking(false);
      }
    };

    setupAuth();

    // Subscribe to real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user);
        if (redirectAfterLogin) {
          const dest = redirectAfterLogin;
          setRedirectAfterLogin(null);
          setCurrentPage(dest);
        } else {
          setCurrentPage('dashboard');
        }
      } else if (event === 'SIGNED_OUT' || !session) {
        resetToCleanGuest();
        setCurrentPage('login');
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const navigate = (page: PageRoute, productId?: string) => {
    if (productId) {
      setSelectedProductId(productId);
    }

    // Protection check for protected routes
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

  /**
   * Search query logging with Supabase persistence
   */
  const recordSearch = async (query: string) => {
    const q = query.trim();
    if (!q) return;

    setSearchHistory(prev => [q, ...prev.filter(item => item.toLowerCase() !== q.toLowerCase())].slice(0, 10));

    if (isLoggedIn && currentUserId) {
      await supabaseService.addSearchQuery(currentUserId, q);
    }
  };

  const clearSearchHistory = async () => {
    setSearchHistory([]);
    if (isLoggedIn && currentUserId) {
      await supabaseService.clearSearchHistory(currentUserId);
    }
  };

  /**
   * Cards Management (Benefits calculation - non sensitive)
   */
  const toggleCardActive = async (cardId: string) => {
    const targetCard = userCards.find(c => c.id === cardId);
    if (!targetCard) return;
    const newActiveState = !targetCard.active;

    setUserCards(prev => prev.map(c => c.id === cardId ? { ...c, active: newActiveState } : c));
    showToast('Preferências de cartões atualizadas!', 'info');

    if (isLoggedIn && currentUserId) {
      await supabaseService.toggleUserCard(currentUserId, cardId, newActiveState);
    }
  };

  const addCard = async (newCardData: Omit<UserCard, 'id'>) => {
    const tempId = `card-${Date.now()}`;
    const newCard: UserCard = {
      ...newCardData,
      id: tempId
    };

    setUserCards(prev => [newCard, ...prev]);
    showToast(`Cartão ${newCard.name} adicionado com sucesso!`, 'success');

    if (isLoggedIn && currentUserId) {
      const saved = await supabaseService.saveUserCard(currentUserId, {
        cardIdentifier: tempId,
        name: newCardData.name,
        bank: newCardData.bank,
        brand: newCardData.brand,
        tier: newCardData.tier,
        pointsPerUsd: newCardData.pointsPerUsd,
        cashbackRate: newCardData.cashbackRate
      });
      if (saved) {
        setUserCards(prev => prev.map(c => c.id === tempId ? { ...c, id: saved.id } : c));
      }
    }
  };

  /**
   * Favorites Operations with Supabase RLS isolation
   */
  const favoriteProductIds = favorites.map(f => f.productId);

  const isFavorite = (productId: string) => {
    return favoriteProductIds.includes(productId);
  };

  const toggleFavorite = async (productId: string) => {
    if (!isLoggedIn || !currentUserId) {
      setRedirectAfterLogin('favorites');
      showToast('Faça login para salvar produtos favoritos.', 'info');
      navigate('login');
      return;
    }

    const exists = isFavorite(productId);

    if (exists) {
      // Remove favorite
      setFavorites(prev => prev.filter(f => f.productId !== productId));
      setUserProfile(prev => ({ ...prev, favoritesCount: Math.max(0, prev.favoritesCount - 1) }));
      showToast('Produto removido dos favoritos', 'info');

      await supabaseService.removeFavorite(currentUserId, productId);
    } else {
      // Add favorite
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

        const saved = await supabaseService.addFavorite(currentUserId, {
          productId: prod.id,
          productName: prod.name,
          productImage: prod.image,
          store: 'Melhor Oferta',
          price: prod.basePrice,
          productUrl: `/product/${prod.id}`
        });

        if (saved) {
          setFavorites(prev => prev.map(f => f.productId === productId ? { ...f, id: saved.id } : f));
        }
      }
    }
  };

  /**
   * Alerts Operations with Supabase RLS isolation
   */
  const addAlert = async (productId: string, targetPrice: number) => {
    if (!isLoggedIn || !currentUserId) {
      setRedirectAfterLogin('alerts');
      showToast('Faça login para criar alertas de preço.', 'info');
      navigate('login');
      return;
    }

    const prod = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
    const tempId = `alt-${Date.now()}`;
    const newAlert: PriceAlert = {
      id: tempId,
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

    const saved = await supabaseService.addAlert(currentUserId, {
      productId: prod.id,
      productName: prod.name,
      productImage: prod.image,
      targetPrice,
      currentPrice: prod.basePrice,
      currentEffectivePrice: Math.round(prod.basePrice * 0.94)
    });

    if (saved) {
      setAlerts(prev => prev.map(a => a.id === tempId ? { ...a, id: saved.id } : a));
    }
  };

  const toggleAlertActive = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, active: !a.active } : a));
    showToast('Status do alerta atualizado', 'info');
  };

  const deleteAlert = async (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    setUserProfile(prev => ({ ...prev, activeAlertsCount: Math.max(0, prev.activeAlertsCount - 1) }));
    showToast('Alerta removido', 'info');

    if (isLoggedIn && currentUserId) {
      await supabaseService.removeAlert(currentUserId, alertId);
    }
  };

  const removeAlert = (alertId: string) => {
    deleteAlert(alertId);
  };

  /**
   * Real Supabase Authentication: Email & Password Login
   */
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.trim() || !password) {
      return { success: false, error: 'Informe e-mail e senha.' };
    }

    try {
      if (!isSupabaseConfigured) {
        return { 
          success: false, 
          error: 'Configuração do Supabase pendente (VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY / VITE_SUPABASE_ANON_KEY necessárias).' 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        let msg = 'E-mail ou senha inválidos.';
        if (error.message.includes('Invalid login credentials')) {
          msg = 'E-mail ou senha incorretos. Verifique suas credenciais.';
        } else if (error.message.includes('Email not confirmed')) {
          msg = 'E-mail não confirmado. Verifique sua caixa de entrada.';
        } else {
          msg = error.message;
        }
        return { success: false, error: msg };
      }

      if (data.user) {
        await loadUserData(data.user);
        showToast('Login realizado com sucesso!', 'success');
        navigate(redirectAfterLogin || 'dashboard');
        setRedirectAfterLogin(null);
        return { success: true };
      }

      return { success: false, error: 'Não foi possível autenticar.' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Erro inesperado no login.' };
    }
  };

  /**
   * Real Supabase Authentication: Register New User
   */
  const register = async (name: string, email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, error: 'Preencha todos os campos obrigatórios.' };
    }

    try {
      if (!isSupabaseConfigured) {
        return { 
          success: false, 
          error: 'Configuração do Supabase pendente (VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY / VITE_SUPABASE_ANON_KEY necessárias).' 
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            name: name.trim(),
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
          }
        }
      });

      if (error) {
        let msg = 'Erro ao criar conta.';
        if (error.message.includes('User already registered')) {
          msg = 'Este e-mail já está cadastrado. Faça login.';
        } else if (error.message.includes('Password should be at least')) {
          msg = 'A senha deve ter no mínimo 6 caracteres.';
        } else {
          msg = error.message;
        }
        return { success: false, error: msg };
      }

      if (data.user) {
        await loadUserData(data.user);
        showToast('Conta criada com sucesso! Bem-vindo(a) ao FindOfertas!', 'success');
        navigate(redirectAfterLogin || 'dashboard');
        setRedirectAfterLogin(null);
        return { success: true };
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Erro inesperado no cadastro.' };
    }
  };

  /**
   * Real Supabase Authentication: Google OAuth Sign-in
   */
  const loginWithGoogle = async (): Promise<void> => {
    if (!isSupabaseConfigured) {
      showToast('Configuração do Supabase Auth pendente nas variáveis de ambiente.', 'error');
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      console.error('Supabase Google OAuth error:', error);
      showToast(error.message || 'Falha ao conectar com o Google.', 'error');
      throw new Error(error.message);
    }
  };

  /**
   * Password Reset
   */
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.trim()) {
      return { success: false, error: 'Informe um endereço de e-mail válido.' };
    }

    if (!isSupabaseConfigured) {
      return { 
        success: false, 
        error: 'Configuração do Supabase pendente para envio de e-mail de recuperação.' 
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Erro ao solicitar recuperação.' };
    }
  };

  /**
   * Real Supabase Logout
   */
  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Error signing out from Supabase:', e);
    } finally {
      resetToCleanGuest();
      showToast('Você saiu da sua conta com segurança.', 'info');
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        searchHistory,
        recordSearch,
        clearSearchHistory,
        selectedProductId,
        setSelectedProductId,
        activeProduct,
        userCards,
        toggleCardActive,
        addCard,
        userPrograms,
        favorites,
        favoriteProductIds,
        toggleFavorite,
        isFavorite,
        alerts,
        userAlerts: alerts,
        addAlert,
        toggleAlertActive,
        deleteAlert,
        removeAlert,
        userProfile,
        setUserProfile,
        isLoggedIn,
        isAuthChecking,
        login,
        register,
        loginWithGoogle,
        resetPassword,
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
