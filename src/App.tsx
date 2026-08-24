import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { Logo } from './components/Logo';
import { EffectivePriceModal } from './components/EffectivePriceModal';
import { AddCardModal } from './components/AddCardModal';
import { AddAlertModal } from './components/AddAlertModal';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FeaturedOffersPage } from './pages/FeaturedOffersPage';
import { PriceHistoryPage } from './pages/PriceHistoryPage';
import { WalletPage } from './pages/WalletPage';
import { BenefitsPage } from './pages/BenefitsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AlertsPage } from './pages/AlertsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/AuthPages';

const MainRouter: React.FC = () => {
  const { currentPage, isLoggedIn, isAuthChecking, navigate, setRedirectAfterLogin } = useApp();

  // 1. Discreet splash/loader while validating real session
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-4 animate-pulse">
          <Logo size="lg" />
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Validando sessão segura...</span>
          </div>
        </div>
      </div>
    );
  }

  const renderProtected = (component: React.ReactNode, route: any) => {
    if (!isLoggedIn) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-5 shadow-sm">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">Área Exclusiva para Membros</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Faça login ou cadastre-se no FindOfertas para acessar sua carteira, benefícios e alertas personalizados.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setRedirectAfterLogin(route);
                  navigate('login');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-blue-200 transition-all cursor-pointer"
              >
                Acessar Minha Conta
              </button>
              <button
                onClick={() => {
                  setRedirectAfterLogin(route);
                  navigate('register');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
              >
                Criar Conta Gratuita
              </button>
            </div>
          </div>
        </div>
      );
    }
    return component;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        // If not logged in and visited root, render login as requested
        return isLoggedIn ? <HomePage /> : <LoginPage />;
      case 'search':
        return <SearchResultsPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'offers':
        return <FeaturedOffersPage />;
      case 'history':
        return <PriceHistoryPage />;
      case 'wallet':
        return renderProtected(<WalletPage />, 'wallet');
      case 'benefits':
        return <BenefitsPage />;
      case 'favorites':
        return renderProtected(<FavoritesPage />, 'favorites');
      case 'alerts':
        return renderProtected(<AlertsPage />, 'alerts');
      case 'dashboard':
        return renderProtected(<DashboardPage />, 'dashboard');
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      default:
        return isLoggedIn ? <HomePage /> : <LoginPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white font-sans">
      {/* Top Fixed Header */}
      <Header />

      {/* Main Page Body */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Global Modals & Notifications */}
      <EffectivePriceModal />
      <AddCardModal />
      <AddAlertModal />
      <Toast />

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar (matching Stitch mockup) */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}

