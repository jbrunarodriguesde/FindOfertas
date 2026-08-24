import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const AddAlertModal: React.FC = () => {
  const { 
    isAddAlertModalOpen, 
    setIsAddAlertModalOpen, 
    targetAlertProduct, 
    addAlert,
    activeProduct 
  } = useApp();

  const product = targetAlertProduct || activeProduct;
  const currentEstEffective = Math.round(product.basePrice * 0.94);
  const [targetPrice, setTargetPrice] = useState<number>(Math.round(currentEstEffective * 0.90));
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);

  if (!isAddAlertModalOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice <= 0) return;
    addAlert(product.id, targetPrice);
    setIsAddAlertModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Criar Alerta de Preço</h3>
              <p className="text-xs text-slate-500">Monitore o Custo Efetivo em tempo real</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddAlertModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Preview */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-200 flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{product.name}</h4>
            <p className="text-[11px] text-slate-500">
              Custo Efetivo Atual: <strong className="text-blue-600">{formatCurrency(currentEstEffective)}</strong>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Avise-me quando o custo efetivo for menor ou igual a:
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">R$</span>
              <input
                type="number"
                step="10"
                min="10"
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-base font-black text-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            
            {/* Quick target discount suggestions */}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setTargetPrice(Math.round(currentEstEffective * 0.95))}
                className="text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors"
              >
                -5% ({formatCurrency(Math.round(currentEstEffective * 0.95))})
              </button>
              <button
                type="button"
                onClick={() => setTargetPrice(Math.round(currentEstEffective * 0.90))}
                className="text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors"
              >
                -10% ({formatCurrency(Math.round(currentEstEffective * 0.90))})
              </button>
              <button
                type="button"
                onClick={() => setTargetPrice(Math.round(currentEstEffective * 0.85))}
                className="text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors"
              >
                -15% ({formatCurrency(Math.round(currentEstEffective * 0.85))})
              </button>
            </div>
          </div>

          {/* Notifications Channels */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-700 block">Onde deseja ser notificado?</span>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span>E-mail cadastrado (notificação instantânea)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={notifyPush}
                onChange={(e) => setNotifyPush(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span>Notificações no navegador / App</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddAlertModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-200 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Bell className="w-3.5 h-3.5" />
              Ativar Alerta
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
