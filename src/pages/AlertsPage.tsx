import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { Bell, Trash2, Plus, ArrowRight, CheckCircle2, TrendingDown } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { userAlerts, removeAlert, openAddAlertModal, navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Alertas de Preço & Custo Efetivo</h1>
          <p className="text-xs text-slate-500">
            Você será notificado por e-mail e push assim que o custo efetivo atingir o valor desejado.
          </p>
        </div>

        <button
          onClick={() => openAddAlertModal()}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Alerta</span>
        </button>
      </div>

      {userAlerts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Nenhum alerta ativo no momento</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Defina uma meta de preço para os produtos que você quer comprar e receba avisos em tempo real.
          </p>
          <button
            onClick={() => navigate('search')}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95"
          >
            <span>Buscar Produtos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {userAlerts.map((alert) => {
            const prodImg = alert.product?.image || (alert as any).productImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80';
            const prodName = alert.product?.name || (alert as any).productName || 'Produto';
            const targetVal = alert.targetEffectivePrice || (alert as any).targetPrice || 0;
            const currentVal = alert.currentEffectivePrice || alert.currentPrice || 0;

            return (
              <div
                key={alert.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={prodImg}
                    alt={prodName}
                    className="w-16 h-16 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <h3 
                      onClick={() => navigate('product', alert.productId)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                    >
                      {prodName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>Preço atual: <strong>{formatCurrency(currentVal)}</strong></span>
                      <span>•</span>
                      <span className="text-blue-600 font-bold">
                        Meta: <strong>{formatCurrency(targetVal)}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Monitorando
                  </span>

                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Excluir alerta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
