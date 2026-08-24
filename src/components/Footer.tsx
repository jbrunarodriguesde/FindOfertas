import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-500 text-xs pb-24 md:pb-12 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Logo size="md" />
            <p className="text-slate-600 text-xs leading-relaxed pt-1">
              Descubra onde realmente vale a pena comprar calculando o Custo Efetivo: preço, frete, descontos no Pix, cashback, pontos e cartões.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                12 lojas sincronizadas
              </span>
            </div>
          </div>

          {/* Navigation Col 1 */}
          <div className="space-y-2.5">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-[11px]">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-blue-600 transition-colors font-medium">
                  Dashboard Principal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('search')} className="hover:text-blue-600 transition-colors font-medium">
                  Comparador de Preços
                </button>
              </li>
              <li>
                <button onClick={() => navigate('offers')} className="hover:text-blue-600 transition-colors font-medium">
                  Melhores Ofertas
                </button>
              </li>
              <li>
                <button onClick={() => navigate('history')} className="hover:text-blue-600 transition-colors font-medium">
                  Histórico de Preços
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Col 2 */}
          <div className="space-y-2.5">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-[11px]">Minha Área</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('wallet')} className="hover:text-blue-600 transition-colors font-medium">
                  Minha Carteira & Cartões
                </button>
              </li>
              <li>
                <button onClick={() => navigate('benefits')} className="hover:text-blue-600 transition-colors font-medium">
                  Benefícios & Milhas
                </button>
              </li>
              <li>
                <button onClick={() => navigate('favorites')} className="hover:text-blue-600 transition-colors font-medium">
                  Produtos Salvos
                </button>
              </li>
              <li>
                <button onClick={() => navigate('alerts')} className="hover:text-blue-600 transition-colors font-medium">
                  Alertas de Custo Efetivo
                </button>
              </li>
            </ul>
          </div>

          {/* Lojas Parceiras */}
          <div className="space-y-2.5">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-[11px]">Lojas Monitoradas</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Amazon', 'Mercado Livre', 'Magazine Luiza', 'Shopee', 'KaBuM!', 'Fast Shop', 'Casas Bahia', 'Americanas'].map((store) => (
                <span key={store} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                  {store}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sem senhas ou acesso à conta bancária</span>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1 leading-relaxed">
          <p className="font-bold text-slate-700">Aviso Legal & Transparência:</p>
          <p>
            O <strong>FindOfertas</strong> é uma plataforma independente de inteligência e comparação de preços. Os valores, estoques, regras de cashback e taxas de pontuação são atualizados periodicamente. Sempre confira as regras e condições finais no site da loja parceira antes de concluir o pagamento.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} FindOfertas. Todos os direitos reservados.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Termos de Uso</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Privacidade & Cookies</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Segurança dos Dados</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
