import { UserProfile } from '../types';
import { GUEST_USER_PROFILE, INITIAL_USER_PROFILE } from '../data/mockWallet';

const AUTH_SESSION_KEY = 'findofertas_session_v1';
const AUTH_USERS_KEY = 'findofertas_registered_users_v1';

export interface StoredSession {
  token: string;
  user: UserProfile;
  expiresAt: number; // Unix epoch ms
  createdAt: number;
  authProvider: 'google' | 'email';
}

export interface StoredUserAccount {
  email: string;
  name: string;
  avatar: string;
  passwordHash?: string;
  authProvider: 'google' | 'email';
  createdAt: string;
  cardsCount?: number;
  totalCashback?: number;
}

/**
 * Checks whether the environment explicitly requested Demo Mode.
 * By default in production/preview, this is false.
 */
export function isDemoModeActive(): boolean {
  try {
    return import.meta.env.VITE_DEMO_MODE === 'true';
  } catch {
    return false;
  }
}

/**
 * Validates the current stored session.
 * Returns the authenticated UserProfile if valid, or null if no valid session exists.
 * Does NOT fallback to demo user unless VITE_DEMO_MODE=true is explicitly configured.
 */
export function getValidatedSession(): { user: UserProfile; token: string } | null {
  // If demo mode is explicitly enabled by environment variable
  if (isDemoModeActive()) {
    return {
      token: 'demo-session-token',
      user: INITIAL_USER_PROFILE
    };
  }

  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
      return null;
    }

    const session: StoredSession = JSON.parse(raw);
    
    // Validate session structure
    if (!session || !session.token || !session.user || !session.expiresAt) {
      localStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }

    // Check expiration (7 days validity)
    if (Date.now() > session.expiresAt) {
      console.info('FindOfertas session expired. Clearing.');
      localStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }

    // Valid session found
    return {
      user: session.user,
      token: session.token
    };
  } catch (e) {
    console.error('Error validating authentication session:', e);
    try {
      localStorage.removeItem(AUTH_SESSION_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}

/**
 * Persists an authenticated user session for 7 days.
 */
export function saveAuthSession(user: UserProfile, authProvider: 'google' | 'email' = 'email'): string {
  const token = `fo_${authProvider}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  const session: StoredSession = {
    token,
    user: {
      ...user,
      authProvider
    },
    expiresAt,
    createdAt: Date.now(),
    authProvider
  };

  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Could not save auth session to localStorage:', e);
  }

  // Also register/update in local user registry
  saveUserToRegistry({
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    authProvider,
    createdAt: user.joinedAt || new Date().toLocaleDateString('pt-BR')
  });

  return token;
}

/**
 * Destroys active authentication session.
 */
export function clearAuthSession(): void {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  } catch (e) {
    console.error('Error clearing auth session:', e);
  }
}

/**
 * Saves or updates a registered user in local accounts registry.
 */
export function saveUserToRegistry(account: StoredUserAccount): void {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    const users: Record<string, StoredUserAccount> = raw ? JSON.parse(raw) : {};
    users[account.email.toLowerCase()] = {
      ...users[account.email.toLowerCase()],
      ...account
    };
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error updating user registry:', e);
  }
}

/**
 * Retrieves a user from local accounts registry if previously registered.
 */
export function getUserFromRegistry(email: string): StoredUserAccount | null {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) return null;
    const users: Record<string, StoredUserAccount> = JSON.parse(raw);
    return users[email.toLowerCase()] || null;
  } catch {
    return null;
  }
}

export { GUEST_USER_PROFILE };
