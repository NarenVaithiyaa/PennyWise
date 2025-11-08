import React, { useState } from 'react';
import { Calendar, IndianRupee, Tag, FileText, CreditCard } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'type'>) => void;
  categories: string[];
  type: 'income' | 'expense';
  initialData?: Omit<Transaction, 'id' | 'type'>;
  onCancel?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  categories,
  type,
  initialData,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    amount: initialData?.amount.toString() || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    account: (initialData?.source || initialData?.destination) || 'bank'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.account) {
      newErrors.account = `${type === 'income' ? 'Destination' : 'Source'} is required`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const transactionData: Omit<Transaction, 'id' | 'type'> = {
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date
    };

    if (type === 'expense') {
      transactionData.source = formData.account as 'bank' | 'wallet';
    } else {
      transactionData.destination = formData.account as 'bank' | 'wallet';
    }

    onSubmit(transactionData);

    if (!initialData) {
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        account: 'bank'
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {initialData ? 'Edit' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <IndianRupee className="inline h-4 w-4 mr-1" />
            Amount (₹)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              errors.amount ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Tag className="inline h-4 w-4 mr-1" />
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              errors.category ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <CreditCard className="inline h-4 w-4 mr-1" />
            {type === 'income' ? 'Destination' : 'Source'}
          </label>
          <select
            value={formData.account}
            onChange={(e) => setFormData(prev => ({ ...prev, account: e.target.value as 'bank' | 'wallet' }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              errors.account ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
          >
            <option value="bank">Bank Account</option>
            <option value="wallet">Wallet</option>
          </select>
          {errors.account && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.account}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Description (Optional)
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="Add a description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              errors.date ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
          />
          {errors.date && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className={`w-full sm:flex-1 py-2 px-4 rounded-lg text-white font-medium transition-colors duration-200 ${
              type === 'income'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {initialData ? 'Update' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;