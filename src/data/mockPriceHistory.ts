import { PriceHistoryData, PriceHistoryPoint } from '../types';

export function generateMockHistory(
  productId: string,
  basePrice: number,
  period: '7d' | '30d' | '90d' | '6m' | '1y'
): PriceHistoryData {
  const points: PriceHistoryPoint[] = [];
  let days = 30;
  if (period === '7d') days = 7;
  else if (period === '30d') days = 30;
  else if (period === '90d') days = 90;
  else if (period === '6m') days = 180;
  else if (period === '1y') days = 365;

  const now = new Date();
  const step = Math.max(1, Math.floor(days / 15));

  let currentP = basePrice * 0.94; // started slightly lower
  let minP = basePrice;
  let maxP = basePrice;
  let sumP = 0;

  for (let i = days; i >= 0; i -= step) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    
    // Simulate realistic wave fluctuation with slight upward/downward drift
    const factor = 1 + (Math.sin(i / 5) * 0.04) + ((days - i) / days * 0.03) + ((i % 3 === 0 ? 0.015 : -0.01));
    const price = Math.round(basePrice * factor);
    const effectivePrice = Math.round(price * 0.94);

    if (price < minP) minP = price;
    if (price > maxP) maxP = price;
    sumP += price;

    const dayStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    points.push({
      date: d.toISOString().split('T')[0],
      displayDate: dayStr,
      price,
      effectivePrice,
      store: i % 2 === 0 ? 'Amazon' : 'Fast Shop'
    });
    currentP = price;
  }

  const avgPrice = Math.round(sumP / points.length);
  const diffFromAvg = Math.round(((currentP - avgPrice) / avgPrice) * 100);
  const trend = diffFromAvg > 1 ? 'up' : diffFromAvg < -1 ? 'down' : 'stable';

  return {
    productId,
    period,
    data: points,
    trend,
    changePct: Math.abs(diffFromAvg),
    minPrice: minP,
    maxPrice: maxP,
    avgPrice: avgPrice
  };
}
