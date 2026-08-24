import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { 
  Search, 
  Heart, 
  Bell, 
  Wallet, 
  User, 
  LogOut, 
  Sparkles, 
  TrendingDown, 
  Menu, 
  X,
  Layers,
  ChevronRight
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const Header: React.FC = () => {
  const { 
    currentPage, 
    navigate, 
    favorites, 
    alerts, 
    userProfile, 
    isLoggedIn, 
    logout 
  } = useApp();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const activeNavClass = (page: string) => 
    currentPage === page 
      ? 'text-blue-600 font-bold' 
      : 'text-slate-600 hover:text-blue-600 transition-colors font-medium';

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 transition-all">
      <div className="flex items-center gap-8">
        
        {/* Mobile menu trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menu principal"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        {/* Logo */}
        <div onClick={() => navigate('home')} className="flex items-center">
          <Logo size="md" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={() => navigate('home')} className={activeNavClass('home')}>
            Dashboard
          </button>
          <button onClick={() => navigate('search')} className={activeNavClass('search')}>
            Buscar
          </button>
          <button onClick={() => navigate('offers')} className={activeNavClass('offers')}>
            Ofertas
          </button>
          <button onClick={() => navigate('history')} className={activeNavClass('history')}>
            Histórico
          </button>
          <button onClick={() => navigate('wallet')} className={activeNavClass('wallet')}>
            Minha Carteira
          </button>
          <button onClick={() => navigate('benefits')} className={activeNavClass('benefits')}>
            Benefícios
          </button>
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        {/* Favorites button */}
        <button
          onClick={() => navigate('favorites')}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative"
          title="Favoritos"
        >
          <Heart className="w-5 h-5" />
          {favorites.length > 0 && (
            <span className="absolute 1 top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          )}
        </button>

        {/* Alerts button */}
        <button
          onClick={() => navigate('alerts')}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative"
          title="Alertas"
        >
          <Bell className="w-5 h-5" />
          {alerts.length > 0 && (
            <span className="absolute 1 top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </button>

        {/* User Profile & Cashback pill block / Auth Actions */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          {isLoggedIn ? (
            <>
              <div 
                onClick={() => navigate('wallet')} 
                className="text-right cursor-pointer hidden sm:block select-none"
              >
                <div className="text-xs text-slate-500">Olá, {userProfile.name.split(' ')[0]}</div>
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  {formatCurrency(userProfile.totalCashbackBalance)}{' '}
                  <span className="text-[10px] font-normal uppercase text-emerald-600 tracking-wider">Cashback</span>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500/20 transition-all"
                  aria-label="Abrir menu do usuário"
                >
                  <img 
                    src={userProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.name}`} 
                    alt={userProfile.name} 
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">Conectada como</p>
                        {userProfile.authProvider === 'google' && (
                          <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded border border-blue-100">Google</span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-slate-800 truncate">{userProfile.email}</p>
                    </div>
                    
                    <button
                      onClick={() => navigate('dashboard')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-blue-600" /> Meu Dashboard
                    </button>
                    <button
                      onClick={() => navigate('wallet')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Wallet className="w-4 h-4 text-emerald-600" /> Minha Carteira & Cartões
                    </button>
                    <button
                      onClick={() => navigate('benefits')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" /> Meus Benefícios & Promoções
                    </button>
                    <button
                      onClick={() => navigate('alerts')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <TrendingDown className="w-4 h-4 text-blue-500" /> Alertas de Custo Efetivo
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sair da conta
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('login')}
                className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('register')}
                className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Cadastre-se
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 border-b border-slate-200 bg-white px-5 pt-3 pb-6 space-y-3 shadow-xl z-50">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => { navigate('home'); setIsMobileMenuOpen(false); }}
              className="text-left p-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold hover:bg-blue-50"
            >
              Dashboard
            </button>
            <button
              onClick={() => { navigate('search'); setIsMobileMenuOpen(false); }}
              className="text-left p-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold hover:bg-blue-50"
            >
              Buscar & Comparar
            </button>
            <button
              onClick={() => { navigate('offers'); setIsMobileMenuOpen(false); }}
              className="text-left p-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold hover:bg-blue-50"
            >
              Ofertas em Destaque
            </button>
            <button
              onClick={() => { navigate('history'); setIsMobileMenuOpen(false); }}
              className="text-left p-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold hover:bg-blue-50"
            >
              Histórico de Preços
            </button>
            <button
              onClick={() => { navigate('wallet'); setIsMobileMenuOpen(false); }}
              className="text-left p-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold hover:bg-blue-50"
            >
              Minha Carteira
            </button>
            <button
              onClick={() => { navigate('benefits'); setIsMobileMenuOpen(false); }}
              className="text-left p-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold hover:bg-blue-50"
            >
              Benefícios & Bônus
            </button>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700">
              Cashback: <span className="text-emerald-600 font-extrabold">{formatCurrency(userProfile.totalCashbackBalance)}</span>
            </div>
            <button
              onClick={() => { navigate('dashboard'); setIsMobileMenuOpen(false); }}
              className="text-xs font-bold text-blue-600 flex items-center gap-1"
            >
              Ver Painel <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
