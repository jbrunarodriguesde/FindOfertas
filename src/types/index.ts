export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  description: string;
  specs: { label: string; value: string }[];
  basePrice: number;
  oldPrice?: number;
  priceChangePct: number; // e.g. -14 or +4
  lowestPrice30d: number;
  highestPrice30d: number;
  avgPrice30d: number;
  isHot?: boolean;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  rating: number;
  trustedBadge: boolean;
  website: string;
}

export interface Offer {
  id: string;
  productId: string;
  storeId: string;
  store: Store;
  originalPrice: number;
  currentPrice: number;
  shippingPrice: number;
  isFreeShipping: boolean;
  discountPixPct: number; // e.g. 10% for Pix/Boleto discount
  couponCode?: string;
  couponDiscountAmount?: number;
  cashbackRate: number; // percentage, e.g. 2, 5
  cashbackProgram: string; // e.g. "Méliuz", "Inter", "C6 Bank", "Zoom"
  pointsMultiplier: number; // e.g. 2.5 pts/$ or 5 pts/R$
  loyaltyProgram: string; // e.g. "Livelo", "Esfera", "C6 Átomos", "Nubank", "Smiles"
  milesMultiplier?: number;
  estimatedDeliveryDays: number;
  affiliateUrl: string;
  inStock: boolean;
  condition: 'novo' | 'reembalado';
  installments?: {
    count: number;
    amount: number;
    interestFree: boolean;
  };
}

export interface EffectiveCostBreakdown {
  originalPrice: number;
  currentPrice: number;
  shippingPrice: number;
  discountAmount: number;
  discountLabel: string;
  cashbackAmount: number;
  cashbackRate: number;
  cashbackLabel: string;
  pointsEarned: number;
  pointsValueReais: number;
  pointsLabel: string;
  milesEarned: number;
  milesValueReais: number;
  milesLabel: string;
  totalEffectiveCost: number;
  totalSavings: number;
  totalSavingsPct: number;
  bestReason: string;
  appliedCardName?: string;
  appliedProgramName?: string;
}

export interface UserCard {
  id: string;
  name: string;
  bank: string;
  brand: 'Visa' | 'Mastercard' | 'Elo' | 'Amex';
  tier: 'Gold' | 'Platinum' | 'Black' | 'Infinite' | 'Standard';
  program: string;
  pointsPerUsd: number;
  cashbackRate: number; // in %
  annualFee: number;
  colorTheme: string; // Tailwind gradient/color token
  active: boolean;
  specialBenefits: string[];
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  logo: string;
  category: 'points' | 'miles' | 'cashback';
  balance: number;
  expiringSoon?: number;
  valuePerThousand: number; // standard liquid value in BRL per 1,000 pts (milheiro)
  partnerStores: string[];
}

export interface PriceHistoryPoint {
  date: string;
  displayDate: string;
  price: number;
  effectivePrice: number;
  store: string;
}

export interface PriceHistoryData {
  productId: string;
  period: '7d' | '30d' | '90d' | '6m' | '1y';
  data: PriceHistoryPoint[];
  trend: 'up' | 'down' | 'stable';
  changePct: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

export interface FavoriteItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
  currentPrice: number;
  currentEffectivePrice: number;
  lowestPrice: number;
  priceChangePct: number;
  alertActive: boolean;
  targetPrice?: number;
}

export interface PriceAlert {
  id: string;
  productId: string;
  product: Product;
  targetEffectivePrice: number;
  currentEffectivePrice: number;
  currentPrice: number;
  active: boolean;
  createdAt: string;
  triggered: boolean;
  notifyEmail: boolean;
  notifyPush: boolean;
}

export interface BenefitPromotion {
  id: string;
  title: string;
  description: string;
  badge: string;
  category: 'transfer' | 'cashback' | 'points' | 'shopping';
  partner: string;
  expiresAt: string;
  bonusRate?: string;
  link?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  estimatedSavings: number;
  trackedOffersCount: number;
  activeAlertsCount: number;
  favoritesCount: number;
  totalCashbackBalance: number;
  totalPointsBalance: number;
  totalMilesBalance: number;
  selectedCardId?: string;
}

export type PageRoute = 
  | 'home'
  | 'search'
  | 'product'
  | 'offers'
  | 'history'
  | 'wallet'
  | 'benefits'
  | 'favorites'
  | 'alerts'
  | 'dashboard'
  | 'login'
  | 'register'
  | 'profile';

export interface FilterOptions {
  selectedStores: string[];
  minPrice?: number;
  maxPrice?: number;
  onlyFreeShipping: boolean;
  onlyWithCashback: boolean;
  onlyWithPoints: boolean;
  inStockOnly: boolean;
  sortBy: 'best_for_you' | 'lowest_effective' | 'lowest_price' | 'highest_cashback' | 'most_points';
}
