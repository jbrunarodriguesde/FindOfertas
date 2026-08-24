import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
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
import { LoginPage, RegisterPage } from './pages/AuthPages';

const MainRouter: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchResultsPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'offers':
        return <FeaturedOffersPage />;
      case 'history':
        return <PriceHistoryPage />;
      case 'wallet':
        return <WalletPage />;
      case 'benefits':
        return <BenefitsPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      default:
        return <HomePage />;
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
