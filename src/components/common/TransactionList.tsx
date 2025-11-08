import React, { useState } from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight, CreditCard, Wallet } from 'lucide-react';
import { Transaction } from '../../types';
import TransactionForm from './TransactionForm';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdate: (id: string, transaction: Omit<Transaction, 'id' | 'type'>) => void;
  onDelete: (id: string) => void;
  categories: string[];
  type: 'income' | 'expense';
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onUpdate,
  onDelete,
  categories,
  type
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleUpdate = (id: string, transactionData: Omit<Transaction, 'id' | 'type'>) => {
    onUpdate(id, transactionData);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      onDelete(id);
    }
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {type === 'income' ? 'Income' : 'Expense'} History
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No {type} records found for this period
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {type === 'income' ? 'Income' : 'Expense'} History ({sortedTransactions.length})
      </h3>

      <div className="space-y-3">
        {sortedTransactions.map((transaction) => {
          if (editingId === transaction.id) {
            return (
              <div key={transaction.id} className="p-4 border border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <TransactionForm
                  onSubmit={(data) => handleUpdate(transaction.id!, data)}
                  categories={categories}
                  type={type}
                  initialData={transaction}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            );
          }

          const account = transaction.source || transaction.destination;

          return (
            <div
              key={transaction.id}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-start sm:items-center gap-3 w-full">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">{transaction.category}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {type}
                    </span>
                    {account && (
                      <div className="flex items-center gap-1">
                        {account === 'bank' ? (
                          <CreditCard className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Wallet className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{account}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{transaction.description || 'No description'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 w-full sm:w-auto sm:justify-end">
                <span
                  className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ₹{transaction.amount.toFixed(2)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(transaction.id!)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id!)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;