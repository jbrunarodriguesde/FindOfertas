import { BenefitPromotion } from '../types';

export const MOCK_BENEFITS_PROMOTIONS: BenefitPromotion[] = [
  {
    id: 'promo-livelo-bonus',
    title: '50% de Bônus na Transferência',
    description: 'Transfira pontos Livelo para a Smiles ou Latam Pass e receba até 50% de bônus creditados em até 10 dias úteis.',
    badge: 'Super Bônus',
    category: 'transfer',
    partner: 'Livelo & Smiles',
    expiresAt: '28 de Fevereiro',
    bonusRate: '+50% Bônus',
    link: 'https://livelo.com.br'
  },
  {
    id: 'promo-cashback-eletronicos',
    title: '5% de Cashback em Eletrônicos na Amazon',
    description: 'Ative a extensão Compara+ ou compre pelo parceiro para acumular 5% de volta direto na sua carteira.',
    badge: 'Cashback Turbo',
    category: 'cashback',
    partner: 'Amazon Brasil',
    expiresAt: 'Hoje até às 23h59',
    bonusRate: '5% Cashback'
  },
  {
    id: 'promo-c6-points',
    title: '2x Pontos em Compras de Tecnologia',
    description: 'Comprando com seu cartão C6 Carbon na Fast Shop ou KaBuM!, ganhe pontuação dobrada: até 5 pontos por dólar.',
    badge: 'Exclusivo C6',
    category: 'points',
    partner: 'C6 Bank & Fast Shop',
    expiresAt: '15 de Março',
    bonusRate: '5 pts / US$'
  },
  {
    id: 'promo-esfera-magalu',
    title: 'Acumule 6 pontos Esfera a cada R$ 1 gasto no Magalu',
    description: 'Oferta especial válida para toda a linha de smartphones, informática e TVs participantes no hotsite.',
    badge: 'Super Pontuação',
    category: 'points',
    partner: 'Esfera & Magalu',
    expiresAt: 'Válido até domingo',
    bonusRate: '6 pts / R$ 1'
  },
  {
    id: 'promo-ultravioleta-cdi',
    title: 'Cashback Instantâneo que rende 200% do CDI',
    description: 'Todo cashback gerado em suas compras através do Nubank Ultravioleta cresce automaticamente sem expirar.',
    badge: 'Rendimento Ativo',
    category: 'cashback',
    partner: 'Nubank Ultravioleta',
    expiresAt: 'Benefício contínuo',
    bonusRate: '200% do CDI'
  }
];
