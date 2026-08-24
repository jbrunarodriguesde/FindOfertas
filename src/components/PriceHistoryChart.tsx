import React, { useState } from 'react';
import { generateMockHistory } from '../data/mockPriceHistory';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface PriceHistoryChartProps {
  productId: string;
  basePrice: number;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ productId, basePrice }) => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '6m' | '1y'>('30d');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const history = generateMockHistory(productId, basePrice, period);
  const points = history.data;

  // Calculate SVG polyline coordinates
  const minVal = history.minPrice * 0.96;
  const maxVal = history.maxPrice * 1.04;
  const range = maxVal - minVal || 1;

  const width = 600;
  const height = 180;
  const paddingX = 20;
  const paddingY = 20;

  const svgPoints = points.map((pt, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((pt.price - minVal) / range) * (height - paddingY * 2);
    return { x, y, ...pt };
  });

  const pathD = svgPoints.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const activePoint = hoveredPointIndex !== null ? svgPoints[hoveredPointIndex] : svgPoints[svgPoints.length - 1];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs">
      
      {/* Header & Period Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Histórico de Preços</h3>
            
            {/* Trend Indicator Pill matching mockup */}
            {history.trend === 'up' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {history.changePct}% acima da média
              </span>
            )}
            {history.trend === 'down' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                <TrendingDown className="w-3 h-3" />
                {history.changePct}% abaixo da média
              </span>
            )}
            {history.trend === 'stable' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                <Minus className="w-3 h-3" />
                Preço estável
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhe a evolução do preço médio nas principais lojas brasileiras.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
          {(['7d', '30d', '90d', '6m', '1y'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg transition-all ${
                period === p
                  ? 'bg-white text-blue-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : p === '90d' ? '90 dias' : p === '6m' ? '6 meses' : '1 ano'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Preço Atual</span>
          <span className="text-sm font-black text-blue-600">{formatCurrency(activePoint.price)}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Menor no Período</span>
          <span className="text-sm font-bold text-emerald-700">{formatCurrency(history.minPrice)}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Maior no Período</span>
          <span className="text-sm font-bold text-slate-700">{formatCurrency(history.maxPrice)}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Preço Médio</span>
          <span className="text-sm font-bold text-slate-600">{formatCurrency(history.avgPrice)}</span>
        </div>
      </div>

      {/* SVG Interactive Line Chart Canvas */}
      <div className="relative pt-2 pb-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoveredPointIndex(null)}
        >
          {/* Subtle horizontal grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="4" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#f1f5f9" strokeDasharray="4" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#e2e8f0" />

          {/* Area fill */}
          <path
            d={`${pathD} L ${svgPoints[svgPoints.length - 1].x} ${height - paddingY} L ${svgPoints[0].x} ${height - paddingY} Z`}
            fill="url(#priceGradient)"
            opacity="0.2"
          />

          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={history.trend === 'up' ? '#ba1a1a' : '#2563eb'} stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Trend line */}
          <path
            d={pathD}
            fill="none"
            stroke={history.trend === 'up' ? '#ba1a1a' : '#2563eb'}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive hover points */}
          {svgPoints.map((pt, idx) => {
            const isSelected = activePoint === pt;
            return (
              <g 
                key={idx}
                onMouseEnter={() => setHoveredPointIndex(idx)}
                className="cursor-pointer"
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 6 : 3.5}
                  fill="#ffffff"
                  stroke={history.trend === 'up' ? '#ba1a1a' : '#2563eb'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all"
                />
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between items-center text-[11px] font-medium text-slate-400 mt-1 px-1">
          <span>{period === '7d' ? '7 dias atrás' : period === '30d' ? '30 dias atrás' : period === '90d' ? '90 dias atrás' : period === '6m' ? '6 meses atrás' : '1 ano atrás'}</span>
          <span className="font-bold text-slate-700">
            {activePoint.displayDate}: {formatCurrency(activePoint.price)}
          </span>
          <span>Hoje</span>
        </div>
      </div>

      {/* Advisory Insight */}
      <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
        <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
        <span>
          {history.trend === 'up'
            ? 'Preço atual acima do menor valor recente. Vale a pena cadastrar um Alerta de Custo Efetivo.'
            : 'Preço em momento favorável de compra em relação à média dos últimos 30 dias.'}
        </span>
      </div>

    </div>
  );
};
