import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
                : isError
                ? 'bg-rose-50/95 border-rose-200 text-rose-900'
                : isWarning
                ? 'bg-amber-50/95 border-amber-200 text-amber-900'
                : 'bg-slate-900/95 border-slate-800 text-white'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-600" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-blue-400" />}
            </div>
            <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current opacity-60 hover:opacity-100 transition-opacity p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const Toast = ToastContainer;

export const DisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 py-1 px-3 bg-slate-100 rounded-full w-fit mx-auto border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block animate-pulse" />
        <span className="font-medium">Valores e benefícios calculados em tempo real</span>
      </div>
    );
  }

  return (
    <div className="bg-blue-50/60 border border-blue-100 text-slate-700 rounded-xl p-3 text-xs flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>
          <strong className="text-slate-900">Simulação inteligente:</strong> Preços, cashback e pontuação são gerados com base nas regras ativas dos seus cartões e lojas parceiras.
        </span>
      </div>
      <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 flex-shrink-0">
        Compara+ Pro
      </span>
    </div>
  );
};
