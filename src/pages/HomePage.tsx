import React from 'react';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { DisclaimerBanner } from '../components/Toast';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { 
  Search, 
  ArrowLeftRight, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  ShieldCheck, 
  CreditCard,
  Zap,
  HelpCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const HomePage: React.FC = () => {
  const { navigate } = useApp();

  const featuredProducts = MOCK_PRODUCTS.slice(0, 6);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Simulation Disclaimer Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <DisclaimerBanner />
      </div>

      {/* Hero Section */}
      <section className="text-center pt-4 pb-4 px-4 max-w-4xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-xs font-bold text-blue-600 shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>O primeiro comparador com Custo Efetivo Real do Brasil</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Descubra onde realmente <br className="hidden sm:inline" />
          <span className="text-blue-600">vale a pena comprar.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Compare preços, cashback, pontos, milhas e benefícios em um só lugar. O melhor preço para o seu perfil financeiro.
        </p>

        {/* Big Hero Search Bar */}
        <div className="pt-2 max-w-2xl mx-auto">
          <SearchBar variant="hero" />
        </div>
      </section>

      {/* Como Funciona? Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Como funciona?</h2>
          <p className="text-sm text-slate-500 mt-1">
            4 passos simples para economizar de verdade em qualquer compra online
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center flex flex-col items-center hover:border-blue-400 hover:shadow-md transition-all shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-200">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">1. Pesquise</h3>
            <p className="text-xs text-slate-500">
              Digite qualquer produto, marca ou modelo desejado.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center flex flex-col items-center hover:border-blue-400 hover:shadow-md transition-all shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-200">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">2. Compare</h3>
            <p className="text-xs text-slate-500">
              Acompanhe preços em tempo real em todas as grandes lojas.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center flex flex-col items-center hover:border-blue-400 hover:shadow-md transition-all shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">3. Benefícios</h3>
            <p className="text-xs text-slate-500">
              Considere cashback, pontos de cartão e frete grátis.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center flex flex-col items-center hover:border-blue-400 hover:shadow-md transition-all shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">4. Escolha</h3>
            <p className="text-xs text-slate-500">
              Compre na loja que gera o menor custo efetivo para você.
            </p>
          </div>
        </div>
      </section>

      {/* "Entenda o Custo Efetivo" Interactive Visual Showcase */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          <div className="text-center max-w-lg mx-auto mb-8">
            <h2 className="text-2xl font-black text-slate-900">Entenda o Custo Efetivo</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Nem sempre a loja com o menor preço anunciado é a mais vantajosa para o seu bolso.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            
            {/* Box 1: Preço Anunciado Tradicional */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 w-full md:w-72 text-center space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Preço Anunciado
              </span>
              <div className="text-3xl font-black text-slate-700">
                R$ 1.000,00
              </div>
              <p className="text-[11px] text-slate-500">
                Valor bruto na vitrine da loja sem considerar seus benefícios.
              </p>
            </div>

            {/* Transition Arrow */}
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Box 2: Custo Efetivo Real (Matching mockup) */}
            <div className="bg-white border-2 border-emerald-500 rounded-2xl p-5 w-full max-w-sm md:w-80 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-xs">
                MÁX. ECONOMIA
              </div>

              <div className="space-y-1 mt-1 pr-16 sm:pr-0">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Custo Efetivo
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  R$ 938,00
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-600 gap-2">
                  <span className="truncate">Cashback (2%)</span>
                  <span className="font-bold text-emerald-600 whitespace-nowrap flex-shrink-0">-R$ 20,00</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 gap-2">
                  <span className="truncate">Pontos (500 pts)</span>
                  <span className="font-bold text-blue-600 whitespace-nowrap flex-shrink-0">-R$ 12,00</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 gap-2">
                  <span className="truncate">Desconto Pix</span>
                  <span className="font-bold text-emerald-600 whitespace-nowrap flex-shrink-0">-R$ 30,00</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                <span>Economia total:</span>
                <span className="font-black whitespace-nowrap">R$ 62,00 (6.2%)</span>
              </div>
            </div>

          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('search')}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-colors shadow-2xs"
            >
              <span>Testar em mais de 10.000 ofertas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* "Ofertas em Destaque" Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Ofertas em destaque</h2>
            <p className="text-xs text-slate-500">Produtos com os maiores descontos e cashbacks do dia</p>
          </div>
          
          <button
            onClick={() => navigate('offers')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, idx) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isBestOption={idx === 0}
            />
          ))}
        </div>
      </section>

      {/* Personalized Benefits & Wallet CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-2 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-blue-400 border border-slate-700">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Personalização Automática</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Cadastre seus cartões e multiplique sua economia
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Ao informar seus cartões (sem número ou senha), o FindOfertas calcula automaticamente os pontos por dólar e cashback exatos de cada oferta.
            </p>
          </div>

          <button
            onClick={() => navigate('wallet')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex-shrink-0 active:scale-95 relative z-10"
          >
            Acessar Minha Carteira
          </button>
        </div>
      </section>

    </div>
  );
};
