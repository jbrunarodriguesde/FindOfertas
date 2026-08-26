import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { FavoriteItem, PriceAlert, UserCard, UserProfile } from '../types';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

// Fallback dummy values to prevent runtime instantiation crash if env is unconfigured in development
const validSupabaseUrl = isSupabaseConfigured ? supabaseUrl : 'https://findofertas-placeholder.supabase.co';
const validSupabaseKey = isSupabaseConfigured ? supabaseAnonKey : 'sb-placeholder-anon-key';

export const supabase: SupabaseClient = createClient(validSupabaseUrl, validSupabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Database Entity Types matching PostgreSQL Schema
export interface DbProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface DbFavorite {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  store: string;
  price: number;
  product_url: string;
  created_at: string;
}

export interface DbAlert {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  target_price: number;
  current_price: number;
  current_effective_price: number;
  active: boolean;
  notify_email: boolean;
  notify_push: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbSearchHistory {
  id: string;
  user_id: string;
  query: string;
  created_at: string;
}

export interface DbUserPreferences {
  id: string;
  user_id: string;
  preferred_stores: string[];
  preferred_categories: string[];
  preferred_payment_methods: string[];
  preferred_loyalty_programs: string[];
  created_at: string;
  updated_at: string;
}

export interface DbUserCard {
  id: string;
  user_id: string;
  card_identifier: string;
  name: string;
  bank: string;
  brand: string;
  tier: string;
  points_per_usd: number;
  cashback_rate: number;
  active: boolean;
  created_at: string;
}

// ==============================================================================
// SUPABASE AUTH & DATA SERVICES
// ==============================================================================

export const supabaseService = {
  /**
   * Profiles API
   */
  async getProfile(userId: string): Promise<DbProfile | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Supabase getProfile error:', error.message);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('Error fetching profile from Supabase:', e);
      return null;
    }
  },

  async upsertProfile(userId: string, data: { name: string; email: string; avatarUrl?: string }): Promise<DbProfile | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data: updated, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          name: data.name,
          email: data.email,
          avatar_url: data.avatarUrl || '',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        console.warn('Supabase upsertProfile error:', error.message);
        return null;
      }
      return updated;
    } catch (e) {
      console.warn('Error saving profile to Supabase:', e);
      return null;
    }
  },

  /**
   * Favorites API
   */
  async getFavorites(userId: string): Promise<DbFavorite[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getFavorites error:', error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.warn('Error fetching favorites:', e);
      return [];
    }
  },

  async addFavorite(userId: string, item: {
    productId: string;
    productName: string;
    productImage?: string;
    store?: string;
    price?: number;
    productUrl?: string;
  }): Promise<DbFavorite | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          product_id: item.productId,
          product_name: item.productName,
          product_image: item.productImage || '',
          store: item.store || '',
          price: item.price || 0,
          product_url: item.productUrl || ''
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase addFavorite error:', error.message);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('Error adding favorite to Supabase:', e);
      return null;
    }
  },

  async removeFavorite(userId: string, productId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) {
        console.warn('Supabase removeFavorite error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Error removing favorite:', e);
      return false;
    }
  },

  /**
   * Alerts API
   */
  async getAlerts(userId: string): Promise<DbAlert[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getAlerts error:', error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.warn('Error fetching alerts:', e);
      return [];
    }
  },

  async addAlert(userId: string, alert: {
    productId: string;
    productName: string;
    productImage?: string;
    targetPrice: number;
    currentPrice?: number;
    currentEffectivePrice?: number;
  }): Promise<DbAlert | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert({
          user_id: userId,
          product_id: alert.productId,
          product_name: alert.productName,
          product_image: alert.productImage || '',
          target_price: alert.targetPrice,
          current_price: alert.currentPrice || 0,
          current_effective_price: alert.currentEffectivePrice || alert.targetPrice,
          active: true,
          notify_email: true,
          notify_push: true
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase addAlert error:', error.message);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('Error adding alert to Supabase:', e);
      return null;
    }
  },

  async removeAlert(userId: string, alertId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('user_id', userId)
        .eq('id', alertId);

      if (error) {
        console.warn('Supabase removeAlert error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Error deleting alert:', e);
      return false;
    }
  },

  /**
   * Search History API
   */
  async getSearchHistory(userId: string): Promise<string[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('query')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('Supabase getSearchHistory error:', error.message);
        return [];
      }
      return data?.map(d => d.query) || [];
    } catch (e) {
      console.warn('Error fetching search history:', e);
      return [];
    }
  },

  async addSearchQuery(userId: string, query: string): Promise<void> {
    if (!isSupabaseConfigured || !query.trim()) return;
    try {
      await supabase
        .from('search_history')
        .insert({
          user_id: userId,
          query: query.trim()
        });
    } catch (e) {
      console.warn('Error saving search history:', e);
    }
  },

  async clearSearchHistory(userId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase
        .from('search_history')
        .delete()
        .eq('user_id', userId);
    } catch (e) {
      console.warn('Error clearing search history:', e);
    }
  },

  /**
   * Preferences API
   */
  async getUserPreferences(userId: string): Promise<DbUserPreferences | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Supabase getUserPreferences error:', error.message);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('Error fetching preferences:', e);
      return null;
    }
  },

  async saveUserPreferences(userId: string, prefs: Partial<DbUserPreferences>): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...prefs,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
    } catch (e) {
      console.warn('Error saving preferences:', e);
    }
  },

  /**
   * User Cards (Benefits calculation only - non-sensitive)
   */
  async getUserCards(userId: string): Promise<DbUserCard[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase getUserCards error:', error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.warn('Error fetching user cards:', e);
      return [];
    }
  },

  async saveUserCard(userId: string, card: {
    cardIdentifier: string;
    name: string;
    bank: string;
    brand: string;
    tier: string;
    pointsPerUsd: number;
    cashbackRate: number;
  }): Promise<DbUserCard | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('user_cards')
        .insert({
          user_id: userId,
          card_identifier: card.cardIdentifier,
          name: card.name,
          bank: card.bank,
          brand: card.brand,
          tier: card.tier,
          points_per_usd: card.pointsPerUsd,
          cashback_rate: card.cashbackRate,
          active: true
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase saveUserCard error:', error.message);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('Error saving user card:', e);
      return null;
    }
  },

  async toggleUserCard(userId: string, cardId: string, active: boolean): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase
        .from('user_cards')
        .update({ active })
        .eq('user_id', userId)
        .eq('id', cardId);

      return !error;
    } catch (e) {
      console.warn('Error toggling user card:', e);
      return false;
    }
  }
};
