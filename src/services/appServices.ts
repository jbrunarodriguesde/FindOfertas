import { Offer, UserCard, LoyaltyProgram, PriceAlert, FavoriteItem, PriceHistoryData } from '../types';
import { MOCK_OFFERS } from '../data/mockOffers';
import { DEFAULT_USER_CARDS, MOCK_LOYALTY_PROGRAMS } from '../data/mockWallet';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { generateMockHistory } from '../data/mockPriceHistory';

export const offerService = {
  async getOffersByProductId(productId: string): Promise<Offer[]> {
    await new Promise(r => setTimeout(r, 60));
    return MOCK_OFFERS.filter(o => o.productId === productId);
  },

  async getAllOffers(): Promise<Offer[]> {
    await new Promise(r => setTimeout(r, 80));
    return [...MOCK_OFFERS];
  }
};

export const walletService = {
  async getUserCards(): Promise<UserCard[]> {
    return [...DEFAULT_USER_CARDS];
  },
  async getLoyaltyPrograms(): Promise<LoyaltyProgram[]> {
    return [...MOCK_LOYALTY_PROGRAMS];
  }
};

export const priceHistoryService = {
  async getHistory(productId: string, period: '7d' | '30d' | '90d' | '6m' | '1y' = '30d'): Promise<PriceHistoryData> {
    const prod = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
    return generateMockHistory(productId, prod.basePrice, period);
  }
};
