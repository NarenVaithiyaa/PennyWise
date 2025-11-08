import React from 'react';
import { Transaction, ExpenseLimit } from '../../types';
import { generateSpendingSuggestions } from '../../utils/suggestions';

interface SpendingSuggestionsProps {
  expenses: Transaction[];
  income: Transaction[];
  expenseLimits: ExpenseLimit[];
  selectedMonth: string;
}

const SpendingSuggestions: React.FC<SpendingSuggestionsProps> = ({
  expenses,
  income,
  expenseLimits,
  selectedMonth
}) => {
  const suggestions = generateSpendingSuggestions(expenses, income, expenseLimits, selectedMonth);

  if (suggestions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Smart Spending Insights</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No specific suggestions at the moment.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Keep tracking your expenses to get personalized insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Smart Spending Insights</h3>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 ${
              suggestion.type === 'warning'
                ? 'bg-red-50 dark:bg-red-900/30 border-red-400'
                : suggestion.type === 'praise'
                ? 'bg-green-50 dark:bg-green-900/30 border-green-400'
                : 'bg-blue-50 dark:bg-blue-900/30 border-blue-400'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-xl">{suggestion.emoji}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  suggestion.type === 'warning'
                    ? 'text-red-800 dark:text-red-200'
                    : suggestion.type === 'praise'
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-blue-800 dark:text-blue-200'
                }`}>
                  {suggestion.message}
                </p>
                {suggestion.category && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Category: {suggestion.category}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingSuggestions;