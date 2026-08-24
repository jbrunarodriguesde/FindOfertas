import { UserCard, LoyaltyProgram, UserProfile } from '../types';

export const GUEST_USER_PROFILE: UserProfile = {
  name: '',
  email: '',
  avatar: '',
  estimatedSavings: 0,
  trackedOffersCount: 0,
  activeAlertsCount: 0,
  favoritesCount: 0,
  totalCashbackBalance: 0,
  totalPointsBalance: 0,
  totalMilesBalance: 0
};

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Bruna',
  email: 'brunarj51@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  estimatedSavings: 342.50,
  trackedOffersCount: 12,
  activeAlertsCount: 4,
  favoritesCount: 8,
  totalCashbackBalance: 342.50,
  totalPointsBalance: 45200,
  totalMilesBalance: 120000,
  selectedCardId: 'card-c6-carbon'
};

export const MOCK_USER_CARDS: UserCard[] = [
  {
    id: 'card-c6-carbon',
    name: 'C6 Carbon Mastercard Black',
    bank: 'C6 Bank',
    brand: 'Mastercard',
    tier: 'Black',
    program: 'C6 Átomos / Livelo',
    pointsPerUsd: 2.5,
    cashbackRate: 1.2,
    annualFee: 0,
    colorTheme: 'from-[#1e293b] to-[#0f172a] text-white border-slate-700',
    active: true,
    specialBenefits: ['LoungeKey', 'C6 Experience', 'Pontos que não expiram', 'Tag C6 Grátis']
  },
  {
    id: 'card-nubank-ultravioleta',
    name: 'Nubank Ultravioleta Black',
    bank: 'Nubank',
    brand: 'Mastercard',
    tier: 'Black',
    program: 'Nu Limite Garantido / Cashback 200% CDI',
    pointsPerUsd: 0,
    cashbackRate: 1.0,
    annualFee: 0,
    colorTheme: 'from-[#820ad1] to-[#4c0677] text-white border-purple-800',
    active: true,
    specialBenefits: ['Cashback 1% que rende 200% do CDI', 'Sala VIP Mastercard Black', 'NuTag', 'Espaço Família']
  },
  {
    id: 'card-xp-visa-infinite',
    name: 'XP Visa Infinite',
    bank: 'XP Investimentos',
    brand: 'Visa',
    tier: 'Infinite',
    program: 'Investback',
    pointsPerUsd: 0,
    cashbackRate: 1.0,
    annualFee: 0,
    colorTheme: 'from-[#1e1e1e] to-[#0a0a0a] text-amber-400 border-zinc-700',
    active: true,
    specialBenefits: ['Investback 1%', 'DragonPass / Visa Airport Companion', 'Seguro Viagem']
  },
  {
    id: 'card-itau-personnalite',
    name: 'Itaú Personnalité Black',
    bank: 'Itaú',
    brand: 'Mastercard',
    tier: 'Black',
    program: 'IUPP / Pontos Itaú',
    pointsPerUsd: 2.0,
    cashbackRate: 0.8,
    annualFee: 0,
    colorTheme: 'from-[#0b2545] to-[#13315c] text-white border-blue-900',
    active: false,
    specialBenefits: ['2.0 pts por dólar', 'Acesso LoungeKey ilimitado', 'Concierge']
  }
];

export const MOCK_LOYALTY_PROGRAMS: LoyaltyProgram[] = [
  {
    id: 'prog-livelo',
    name: 'Livelo',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=64&auto=format&fit=crop&q=80',
    category: 'points',
    balance: 28400,
    expiringSoon: 0,
    valuePerThousand: 35.0,
    partnerStores: ['Amazon', 'Fast Shop', 'Magalu', 'Casas Bahia']
  },
  {
    id: 'prog-esfera',
    name: 'Esfera Santander',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=64&auto=format&fit=crop&q=80',
    category: 'points',
    balance: 16800,
    expiringSoon: 1200,
    valuePerThousand: 35.0,
    partnerStores: ['Magalu', 'Fast Shop', 'Casas Bahia']
  },
  {
    id: 'prog-smiles',
    name: 'Smiles GOL',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=64&auto=format&fit=crop&q=80',
    category: 'miles',
    balance: 75000,
    expiringSoon: 0,
    valuePerThousand: 17.5,
    partnerStores: ['Shopping Smiles', 'Casas Bahia', 'Ponto']
  },
  {
    id: 'prog-latampass',
    name: 'LATAM Pass',
    logo: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=64&auto=format&fit=crop&q=80',
    category: 'miles',
    balance: 45000,
    expiringSoon: 0,
    valuePerThousand: 22.0,
    partnerStores: ['Shopping LATAM Pass', 'Magalu']
  },
  {
    id: 'prog-meliuz',
    name: 'Méliuz Cashback',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=64&auto=format&fit=crop&q=80',
    category: 'cashback',
    balance: 127.50,
    valuePerThousand: 1000.0,
    partnerStores: ['Amazon', 'Fast Shop', 'KaBuM!', 'Nike']
  }
];
