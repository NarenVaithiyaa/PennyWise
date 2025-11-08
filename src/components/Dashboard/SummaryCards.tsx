import React from 'react';
import { TrendingUp, TrendingDown, PiggyBank, Target } from 'lucide-react';
import { Transaction } from '../../types';
import {
  filterByMonth,
  getTotalAmount,
  getMonthlySavings,
  getSavingsRate
} from '../../utils/calculations';

interface SummaryCardsProps {
  expenses: Transaction[];
  income: Transaction[];
  selectedMonth: string;
  selectedYear: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  expenses,
  income,
  selectedMonth,
  selectedYear: _selectedYear
}) => {
  const monthlyExpenses = getTotalAmount(filterByMonth(expenses, selectedMonth));
  const monthlyIncome = getTotalAmount(filterByMonth(income, selectedMonth));
  const monthlySavings = getMonthlySavings(expenses, income, selectedMonth);
  const savingsRate = getSavingsRate(monthlySavings, monthlyIncome);

  const cards = [
    {
      title: 'Monthly Income',
      amount: monthlyIncome,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Monthly Expenses',
      amount: monthlyExpenses,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Monthly Savings',
      amount: monthlySavings,
      icon: PiggyBank,
      color: monthlySavings >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: monthlySavings >= 0 ? 'bg-blue-50' : 'bg-red-50',
      borderColor: monthlySavings >= 0 ? 'border-blue-200' : 'border-red-200'
    },
    {
      title: 'Savings Rate',
      amount: savingsRate,
      icon: Target,
      color: savingsRate >= 20 ? 'text-green-600' : savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600',
      bgColor: savingsRate >= 20 ? 'bg-green-50' : savingsRate >= 10 ? 'bg-yellow-50' : 'bg-red-50',
      borderColor: savingsRate >= 20 ? 'border-green-200' : savingsRate >= 10 ? 'border-yellow-200' : 'border-red-200',
      isPercentage: true
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Monthly Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`p-4 sm:p-5 rounded-xl border ${card.borderColor} ${card.bgColor} dark:bg-gray-700 dark:border-gray-600 transition-all duration-200 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{card.title}</p>
                  <p className={`text-lg sm:text-xl font-bold ${card.color}`}>
                    {card.isPercentage ? `${card.amount.toFixed(1)}%` : `₹${card.amount.toFixed(2)}`}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryCards;