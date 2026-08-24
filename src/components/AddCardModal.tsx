import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CreditCard, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import { UserCard } from '../types';

export const AddCardModal: React.FC = () => {
  const { isAddCardModalOpen, setIsAddCardModalOpen, addCard } = useApp();

  const [name, setName] = useState('');
  const [bank, setBank] = useState('C6 Bank');
  const [brand, setBrand] = useState<'Mastercard' | 'Visa' | 'Elo' | 'Amex'>('Mastercard');
  const [tier, setTier] = useState<'Black' | 'Infinite' | 'Platinum' | 'Gold' | 'Standard'>('Black');
  const [program, setProgram] = useState('Livelo');
  const [pointsPerUsd, setPointsPerUsd] = useState(2.0);
  const [cashbackRate, setCashbackRate] = useState(1.0);
  const [benefitTag, setBenefitTag] = useState('');
  const [specialBenefits, setSpecialBenefits] = useState<string[]>(['Sala VIP LoungeKey', 'Seguro Viagem']);

  if (!isAddCardModalOpen) return null;

  const handleAddBenefit = () => {
    if (benefitTag.trim() && !specialBenefits.includes(benefitTag.trim())) {
      setSpecialBenefits([...specialBenefits, benefitTag.trim()]);
      setBenefitTag('');
    }
  };

  const handleRemoveBenefit = (tag: string) => {
    setSpecialBenefits(specialBenefits.filter(b => b !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCardData: Omit<UserCard, 'id'> = {
      name: name.trim(),
      bank,
      brand,
      tier,
      program,
      pointsPerUsd: Number(pointsPerUsd) || 0,
      cashbackRate: Number(cashbackRate) || 0,
      annualFee: 0,
      colorTheme: brand === 'Visa' 
        ? 'from-[#1e1e1e] to-[#0a0a0a] text-amber-400 border-zinc-700'
        : 'from-[#1e293b] to-[#0f172a] text-white border-slate-700',
      active: true,
      specialBenefits
    };

    addCard(newCardData);
    setIsAddCardModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Cadastrar Novo Cartão</h3>
              <p className="text-xs text-slate-500">Configure suas regras de pontuação e cashback</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddCardModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-800 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong className="font-bold">100% Seguro:</strong> Nunca solicitamos número de cartão, CVV, senhas ou dados bancários.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Card Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nome do Cartão *</label>
            <input
              type="text"
              required
              placeholder="Ex: C6 Carbon Black, Nubank Ultravioleta..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-slate-800"
            />
          </div>

          {/* Bank & Brand */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Instituição / Banco</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium outline-none focus:border-blue-600"
              >
                <option value="C6 Bank">C6 Bank</option>
                <option value="Nubank">Nubank</option>
                <option value="Itaú">Itaú</option>
                <option value="XP">XP Investimentos</option>
                <option value="Santander">Santander</option>
                <option value="Bradesco">Bradesco</option>
                <option value="Inter">Banco Inter</option>
                <option value="BTG Pactual">BTG Pactual</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bandeira & Categoria</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium outline-none focus:border-blue-600"
              >
                <option value="Mastercard">Mastercard</option>
                <option value="Visa">Visa</option>
                <option value="Elo">Elo</option>
                <option value="Amex">American Express</option>
              </select>
            </div>
          </div>

          {/* Program & Tier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Programa Principal</label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="Ex: Livelo, Esfera, Átomos"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Categoria (Tier)</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium outline-none focus:border-blue-600"
              >
                <option value="Black">Black / Metal</option>
                <option value="Infinite">Infinite</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          {/* Reward Rates */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <label className="block font-bold text-blue-600 mb-1">Pontos por US$ Gasto</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={pointsPerUsd}
                onChange={(e) => setPointsPerUsd(parseFloat(e.target.value) || 0)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 font-bold text-center"
              />
            </div>

            <div>
              <label className="block font-bold text-emerald-700 mb-1">Cashback Padrão (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="15"
                value={cashbackRate}
                onChange={(e) => setCashbackRate(parseFloat(e.target.value) || 0)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 font-bold text-center"
              />
            </div>
          </div>

          {/* Special Perks Tags */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Benefícios Especiais</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Adicionar benefício (ex: Tag grátis, 200% CDI...)"
                value={benefitTag}
                onChange={(e) => setBenefitTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddBenefit(); } }}
                className="flex-1 h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {specialBenefits.map((b) => (
                <span
                  key={b}
                  className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] font-medium"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {b}
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(b)}
                    className="hover:text-rose-500 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddCardModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-200 transition-all active:scale-95"
            >
              Salvar Cartão
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
