import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit2, Trash2 } from 'lucide-react';
import { Transaction } from '../../types';
import { getMonthlySavings } from '../../utils/calculations';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface SavingsGoalsProps {
  expenses: Transaction[];
  income: Transaction[];
  selectedMonth: string;
}

const SavingsGoals: React.FC<SavingsGoalsProps> = ({ expenses, income, selectedMonth }) => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: ''
  });

  const monthlySavings = getMonthlySavings(expenses, income, selectedMonth);

  useEffect(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
  }, [goals]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goalData = {
      id: editingGoal?.id || Date.now().toString(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: editingGoal?.currentAmount || 0,
      deadline: formData.deadline
    };

    if (editingGoal) {
      setGoals(prev => prev.map(goal => 
        goal.id === editingGoal.id ? goalData : goal
      ));
    } else {
      setGoals(prev => [...prev, goalData]);
    }

    setFormData({ name: '', targetAmount: '', deadline: '' });
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      deadline: goal.deadline
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setGoals(prev => prev.filter(goal => goal.id !== id));
    }
  };

  const addToGoal = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(goal =>
      goal.id === goalId
        ? { ...goal, currentAmount: Math.max(0, goal.currentAmount + amount) }
        : goal
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goals</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goal Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {editingGoal ? 'Update' : 'Add'} Goal
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingGoal(null);
                setFormData({ name: '', targetAmount: '', deadline: '' });
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No savings goals yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Create your first goal to start tracking</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={goal.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{goal.name}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span>₹{goal.currentAmount.toFixed(2)} / ₹{goal.targetAmount.toFixed(2)}</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className={`${daysLeft > 0 ? 'text-gray-600 dark:text-gray-300' : 'text-red-600'}`}>
                    {daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                  </span>
                  {monthlySavings > 0 && (
                    <button
                      onClick={() => addToGoal(goal.id, monthlySavings)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200"
                    >
                      Add Monthly Savings
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;