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
      return <LoginPage />;
    }
    return component;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
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
        return isLoggedIn ? <DashboardPage /> : <LoginPage />;
      case 'register':
        return isLoggedIn ? <DashboardPage /> : <RegisterPage />;
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

