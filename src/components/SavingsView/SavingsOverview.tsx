import React from 'react';
import { TrendingUp, Target, Calendar, DollarSign } from 'lucide-react';
import { Transaction } from '../../types';
import {
  filterByMonth,
  filterByYear,
  getTotalAmount,
  getMonthlySavings,
  getYearlySavings,
  getSavingsRate
} from '../../utils/calculations';

interface SavingsOverviewProps {
  expenses: Transaction[];
  income: Transaction[];
  selectedMonth: string;
  selectedYear: number;
}

const SavingsOverview: React.FC<SavingsOverviewProps> = ({
  expenses,
  income,
  selectedMonth,
  selectedYear
}) => {
  const monthlyIncome = getTotalAmount(filterByMonth(income, selectedMonth));
  const monthlySavings = getMonthlySavings(expenses, income, selectedMonth);
  const yearlySavings = getYearlySavings(expenses, income, selectedYear);
  const monthlySavingsRate = getSavingsRate(monthlySavings, monthlyIncome);

  const yearlyIncome = getTotalAmount(filterByYear(income, selectedYear));
  const yearlySavingsRate = getSavingsRate(yearlySavings, yearlyIncome);

  const cards = [
    {
      title: 'Monthly Savings',
      amount: monthlySavings,
      icon: DollarSign,
      color: monthlySavings >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: monthlySavings >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30',
      borderColor: monthlySavings >= 0 ? 'border-green-200 dark:border-green-700' : 'border-red-200 dark:border-red-700'
    },
    {
      title: 'Monthly Savings Rate',
      amount: monthlySavingsRate,
      icon: Target,
      color: monthlySavingsRate >= 20 ? 'text-green-600' : monthlySavingsRate >= 10 ? 'text-yellow-600' : 'text-red-600',
      bgColor: monthlySavingsRate >= 20 ? 'bg-green-50 dark:bg-green-900/30' : monthlySavingsRate >= 10 ? 'bg-yellow-50 dark:bg-yellow-900/30' : 'bg-red-50 dark:bg-red-900/30',
      borderColor: monthlySavingsRate >= 20 ? 'border-green-200 dark:border-green-700' : monthlySavingsRate >= 10 ? 'border-yellow-200 dark:border-yellow-700' : 'border-red-200 dark:border-red-700',
      isPercentage: true
    },
    {
      title: 'Yearly Savings',
      amount: yearlySavings,
      icon: Calendar,
      color: yearlySavings >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: yearlySavings >= 0 ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-red-50 dark:bg-red-900/30',
      borderColor: yearlySavings >= 0 ? 'border-blue-200 dark:border-blue-700' : 'border-red-200 dark:border-red-700'
    },
    {
      title: 'Yearly Savings Rate',
      amount: yearlySavingsRate,
      icon: TrendingUp,
      color: yearlySavingsRate >= 20 ? 'text-green-600' : yearlySavingsRate >= 10 ? 'text-yellow-600' : 'text-red-600',
      bgColor: yearlySavingsRate >= 20 ? 'bg-green-50 dark:bg-green-900/30' : yearlySavingsRate >= 10 ? 'bg-yellow-50 dark:bg-yellow-900/30' : 'bg-red-50 dark:bg-red-900/30',
      borderColor: yearlySavingsRate >= 20 ? 'border-green-200 dark:border-green-700' : yearlySavingsRate >= 10 ? 'border-yellow-200 dark:border-yellow-700' : 'border-red-200 dark:border-red-700',
      isPercentage: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`p-6 rounded-xl border ${card.borderColor} ${card.bgColor} transition-all duration-200 hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.isPercentage ? `${card.amount.toFixed(1)}%` : `₹${card.amount.toFixed(2)}`}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavingsOverview;