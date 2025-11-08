import React from 'react';
import { Calendar, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Transaction } from '../../types';
import { filterByDate, getTotalAmount, getDailySavings, getCurrentDate } from '../../utils/calculations';

interface DailySummaryProps {
  expenses: Transaction[];
  income: Transaction[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ expenses, income }) => {
  const today = getCurrentDate();
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const dailyExpenses = getTotalAmount(filterByDate(expenses, today));
  const dailyIncome = getTotalAmount(filterByDate(income, today));
  const dailySavings = getDailySavings(expenses, income, today);

  const cards = [
    {
      title: "Today's Income",
      amount: dailyIncome,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: "Today's Expenses",
      amount: dailyExpenses,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: "Today's Savings",
      amount: dailySavings,
      icon: PiggyBank,
      color: dailySavings >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: dailySavings >= 0 ? 'bg-blue-50' : 'bg-red-50',
      borderColor: dailySavings >= 0 ? 'border-blue-200' : 'border-red-200'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Summary</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">({todayFormatted})</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${card.borderColor} ${card.bgColor} dark:bg-gray-700 dark:border-gray-600 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{card.title}</p>
                  <p className={`text-xl font-bold ${card.color}`}>
                    ₹{card.amount.toFixed(2)}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailySummary;