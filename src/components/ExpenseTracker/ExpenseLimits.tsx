import React, { useState } from 'react';
import { Target, Plus, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { ExpenseLimit } from '../../types';
import { EXPENSE_CATEGORIES } from '../../constants';
import { getCurrentMonth } from '../../utils/calculations';

interface ExpenseLimitsProps {
  expenseLimits: ExpenseLimit[];
  onUpdateExpenseLimits: (limits: ExpenseLimit[]) => void;
  selectedMonth: string;
}

const ExpenseLimits: React.FC<ExpenseLimitsProps> = ({
  expenseLimits,
  onUpdateExpenseLimits,
  selectedMonth
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingLimit, setEditingLimit] = useState<ExpenseLimit | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  });

  const currentMonthLimits = expenseLimits.filter(limit => limit.month === selectedMonth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const limitData: ExpenseLimit = {
      category: formData.category,
      limit: parseFloat(formData.limit),
      month: selectedMonth
    };

    if (editingLimit) {
      // Update existing limit
      const updatedLimits = expenseLimits.map(limit =>
        limit.category === editingLimit.category && limit.month === editingLimit.month
          ? limitData
          : limit
      );
      onUpdateExpenseLimits(updatedLimits);
    } else {
      // Add new limit
      const existingLimitIndex = expenseLimits.findIndex(
        limit => limit.category === formData.category && limit.month === selectedMonth
      );
      
      if (existingLimitIndex >= 0) {
        // Update existing limit for this category and month
        const updatedLimits = [...expenseLimits];
        updatedLimits[existingLimitIndex] = limitData;
        onUpdateExpenseLimits(updatedLimits);
      } else {
        // Add new limit
        onUpdateExpenseLimits([...expenseLimits, limitData]);
      }
    }

    setFormData({ category: '', limit: '' });
    setShowForm(false);
    setEditingLimit(null);
  };

  const handleEdit = (limit: ExpenseLimit) => {
    setEditingLimit(limit);
    setFormData({
      category: limit.category,
      limit: limit.limit.toString()
    });
    setShowForm(true);
  };

  const handleDelete = (category: string) => {
    if (confirm(`Are you sure you want to delete the limit for ${category}?`)) {
      const updatedLimits = expenseLimits.filter(
        limit => !(limit.category === category && limit.month === selectedMonth)
      );
      onUpdateExpenseLimits(updatedLimits);
    }
  };

  const resetLimitsForNewMonth = () => {
    const currentMonth = getCurrentMonth();
    if (currentMonth !== selectedMonth) return;

    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    const prevMonthStr = previousMonth.toISOString().slice(0, 7);

    const previousMonthLimits = expenseLimits.filter(limit => limit.month === prevMonthStr);
    
    if (previousMonthLimits.length > 0) {
      const newLimits = previousMonthLimits.map(limit => ({
        ...limit,
        month: currentMonth
      }));
      
      onUpdateExpenseLimits([...expenseLimits, ...newLimits]);
    }
  };

  const availableCategories = EXPENSE_CATEGORIES.filter(category =>
    !currentMonthLimits.some(limit => limit.category === category)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Expense Limits</h3>
        <div className="flex space-x-2">
          {getCurrentMonth() === selectedMonth && (
            <button
              onClick={resetLimitsForNewMonth}
              className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Copy limits from previous month"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Limit</span>
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!!editingLimit}
              >
                <option value="">Select a category</option>
                {(editingLimit ? [editingLimit.category] : availableCategories).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Limit (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.limit}
                onChange={(e) => setFormData(prev => ({ ...prev, limit: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {editingLimit ? 'Update' : 'Add'} Limit
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingLimit(null);
                setFormData({ category: '', limit: '' });
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {currentMonthLimits.length === 0 ? (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No expense limits set for this month</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Set limits to track your spending goals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentMonthLimits.map((limit) => (
            <div
              key={limit.category}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{limit.category}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Monthly limit</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  ₹{limit.limit.toFixed(2)}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(limit)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    title="Edit limit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(limit.category)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    title="Delete limit"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>• Limits are set per month and reset automatically</p>
        <p>• Use the reset button to copy limits from the previous month</p>
      </div>
    </div>
  );
};

export default ExpenseLimits;