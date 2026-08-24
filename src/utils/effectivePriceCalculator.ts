import { Offer, UserCard, LoyaltyProgram, EffectiveCostBreakdown } from '../types';

export const DEFAULT_USD_RATE = 5.70;
export const DEFAULT_POINT_VALUE_PER_THOUSAND = 35.0; // R$ 35 per 1,000 pts (Livelo/Esfera standard)
export const DEFAULT_MILE_VALUE_PER_THOUSAND = 18.0; // R$ 18 per 1,000 miles (Smiles/Latam standard)

/**
 * Calculates the real Effective Cost (Custo Efetivo) for an offer,
 * factoring in price, shipping, instant discounts, cashback, points & card rewards.
 */
export function calculateEffectivePrice(
  offer: Offer,
  activeCards: UserCard[] = [],
  _activePrograms: LoyaltyProgram[] = [],
  selectedCardId?: string
): EffectiveCostBreakdown {
  const originalPrice = offer.originalPrice || offer.currentPrice;
  const currentPrice = offer.currentPrice;
  const shippingPrice = offer.isFreeShipping ? 0 : offer.shippingPrice;

  // 1. Discount (Pix, coupon or instant cash discount)
  let discountAmount = 0;
  let discountLabel = '';

  if (offer.couponDiscountAmount && offer.couponDiscountAmount > 0) {
    discountAmount += offer.couponDiscountAmount;
    discountLabel = `Cupom ${offer.couponCode || 'APLICADO'}`;
  } else if (offer.discountPixPct && offer.discountPixPct > 0) {
    // Pix discount applied on current price
    discountAmount += (currentPrice * (offer.discountPixPct / 100));
    discountLabel = `Desconto Pix (${offer.discountPixPct}%)`;
  }

  // 2. Select card benefit (highest cashback or selected card)
  let bestCard: UserCard | undefined;
  if (selectedCardId) {
    bestCard = activeCards.find(c => c.id === selectedCardId);
  }
  if (!bestCard && activeCards.length > 0) {
    // Pick the user's best active card based on highest combined reward
    bestCard = activeCards.reduce((best, cur) => {
      const bestScore = best.cashbackRate + (best.pointsPerUsd * 0.4);
      const curScore = cur.cashbackRate + (cur.pointsPerUsd * 0.4);
      return curScore > bestScore ? cur : best;
    }, activeCards[0]);
  }

  // 3. Cashback calculation
  // Store cashback + card cashback
  let totalCashbackRate = offer.cashbackRate || 0;
  if (bestCard && bestCard.cashbackRate > 0) {
    totalCashbackRate = Math.max(totalCashbackRate, totalCashbackRate + (bestCard.cashbackRate * 0.5));
  }

  const cashbackAmount = (currentPrice * (totalCashbackRate / 100));
  const cashbackLabel = totalCashbackRate > 0
    ? `Cashback (${totalCashbackRate.toFixed(1).replace('.0', '')}% ${offer.cashbackProgram || 'Compara+'})`
    : 'Sem cashback';

  // 4. Points calculation
  let pointsEarned = 0;
  let pointsValueReais = 0;
  let pointsLabel = 'Sem pontos';

  if (offer.pointsMultiplier > 0) {
    // Store specific promotion (e.g. 5 pts per R$)
    pointsEarned = Math.round(currentPrice * offer.pointsMultiplier);
    pointsValueReais = (pointsEarned / 1000) * DEFAULT_POINT_VALUE_PER_THOUSAND;
    pointsLabel = `Pontos ${offer.loyaltyProgram} (${pointsEarned.toLocaleString('pt-BR')} pts)`;
  } else if (bestCard && bestCard.pointsPerUsd > 0) {
    // Card points based on USD spent
    const usdSpent = currentPrice / DEFAULT_USD_RATE;
    pointsEarned = Math.round(usdSpent * bestCard.pointsPerUsd);
    pointsValueReais = (pointsEarned / 1000) * DEFAULT_POINT_VALUE_PER_THOUSAND;
    pointsLabel = `Pontos ${bestCard.program} (${pointsEarned.toLocaleString('pt-BR')} pts)`;
  }

  // 5. Miles calculation
  let milesEarned = 0;
  let milesValueReais = 0;
  let milesLabel = 'Sem milhas';
  if (offer.milesMultiplier && offer.milesMultiplier > 0) {
    milesEarned = Math.round(currentPrice * offer.milesMultiplier);
    milesValueReais = (milesEarned / 1000) * DEFAULT_MILE_VALUE_PER_THOUSAND;
    milesLabel = `Milhas (${milesEarned.toLocaleString('pt-BR')} milhas)`;
  }

  // 6. Effective Cost Formula:
  // Custo Efetivo = Preço + Frete - Desconto - Cashback - Valor dos Pontos - Valor das Milhas
  const subtotal = currentPrice + shippingPrice;
  const deductions = discountAmount + cashbackAmount + pointsValueReais + milesValueReais;
  const totalEffectiveCost = Math.max(0, Math.round((subtotal - deductions) * 100) / 100);

  const totalSavings = Math.max(0, Math.round((originalPrice + shippingPrice - totalEffectiveCost) * 100) / 100);
  const totalSavingsPct = originalPrice > 0 ? (totalSavings / originalPrice) * 100 : 0;

  // Best reason synthesis
  let bestReason = 'Melhor custo efetivo';
  if (cashbackAmount > 50 && cashbackAmount > pointsValueReais) {
    bestReason = `Você recebe mais cashback nesta oferta (+${totalCashbackRate}% de volta)`;
  } else if (pointsValueReais > 40) {
    bestReason = `Seu cartão acumula ${pointsEarned.toLocaleString('pt-BR')} pontos nesta compra`;
  } else if (offer.isFreeShipping && discountAmount > 0) {
    bestReason = 'Frete Grátis + Desconto imediato no pagamento';
  } else if (offer.isFreeShipping) {
    bestReason = 'Frete Grátis e entrega rápida garantida';
  }

  return {
    originalPrice,
    currentPrice,
    shippingPrice,
    discountAmount: Math.round(discountAmount * 100) / 100,
    discountLabel,
    cashbackAmount: Math.round(cashbackAmount * 100) / 100,
    cashbackRate: totalCashbackRate,
    cashbackLabel,
    pointsEarned,
    pointsValueReais: Math.round(pointsValueReais * 100) / 100,
    pointsLabel,
    milesEarned,
    milesValueReais: Math.round(milesValueReais * 100) / 100,
    milesLabel,
    totalEffectiveCost,
    totalSavings,
    totalSavingsPct: Math.round(totalSavingsPct * 10) / 10,
    bestReason,
    appliedCardName: bestCard?.name,
    appliedProgramName: bestCard?.program || offer.loyaltyProgram,
  };
}
