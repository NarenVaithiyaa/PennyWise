import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  expenses: Transaction[];
  income: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ expenses, income }) => {
  const allTransactions = [...expenses, ...income]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  if (allTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {allTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{transaction.category}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;