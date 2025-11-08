import { Transaction, ExpenseLimit, SpendingSuggestion } from '../types';
import { filterByMonth, getAmountByCategory } from './calculations';

export const generateSpendingSuggestions = (
  expenses: Transaction[],
  income: Transaction[],
  expenseLimits: ExpenseLimit[],
  selectedMonth: string
): SpendingSuggestion[] => {
  const suggestions: SpendingSuggestion[] = [];
  const monthlyExpenses = filterByMonth(expenses, selectedMonth);
  const monthlyIncome = filterByMonth(income, selectedMonth);
  const expensesByCategory = getAmountByCategory(monthlyExpenses);
  
  // Get current month limits
  const currentLimits = expenseLimits.filter(limit => limit.month === selectedMonth);
  
  // Check for overspending
  currentLimits.forEach(limit => {
    const spent = expensesByCategory[limit.category] || 0;
    const percentage = (spent / limit.limit) * 100;
    
    if (spent > limit.limit) {
      suggestions.push({
        type: 'warning',
        emoji: '⚠️',
        message: `You've exceeded your ${limit.category} budget by ₹${(spent - limit.limit).toFixed(2)}. Consider reducing spending in this category.`,
        category: limit.category
      });
    } else if (percentage > 80) {
      suggestions.push({
        type: 'warning',
        emoji: '🚨',
        message: `You've used ${percentage.toFixed(0)}% of your ${limit.category} budget. You're close to your limit!`,
        category: limit.category
      });
    }
  });

  // Positive spending patterns
  const educationSpent = expensesByCategory['Education'] || 0;
  const entertainmentSpent = expensesByCategory['Entertainment'] || 0;
  const selfImprovementSpent = expensesByCategory['Self-improvement'] || 0;
  
  // Praise for education spending
  if (educationSpent > entertainmentSpent && educationSpent > 0) {
    suggestions.push({
      type: 'praise',
      emoji: '👍',
      message: `Great job prioritizing education over entertainment! You've invested ₹${educationSpent.toFixed(2)} in your learning.`,
      category: 'Education'
    });
  }

  // Praise for self-improvement
  if (selfImprovementSpent > 0 && selfImprovementSpent > entertainmentSpent) {
    suggestions.push({
      type: 'praise',
      emoji: '💪',
      message: `Excellent focus on self-improvement! You've invested ₹${selfImprovementSpent.toFixed(2)} in bettering yourself.`,
      category: 'Self-improvement'
    });
  }

  // Low entertainment spending praise
  const entertainmentLimit = currentLimits.find(l => l.category === 'Entertainment');
  if (entertainmentLimit && entertainmentSpent < entertainmentLimit.limit * 0.5) {
    suggestions.push({
      type: 'praise',
      emoji: '🎯',
      message: `Well done on controlling entertainment expenses! You're using only ${((entertainmentSpent / entertainmentLimit.limit) * 100).toFixed(0)}% of your budget.`,
      category: 'Entertainment'
    });
  }

  // Savings rate suggestions
  const totalIncome = monthlyIncome.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  if (savingsRate >= 20) {
    suggestions.push({
      type: 'praise',
      emoji: '🌟',
      message: `Outstanding! You're saving ${savingsRate.toFixed(1)}% of your income. Keep up this excellent financial discipline!`
    });
  } else if (savingsRate >= 10) {
    suggestions.push({
      type: 'info',
      emoji: '📈',
      message: `Good savings rate of ${savingsRate.toFixed(1)}%. Try to reach 20% for even better financial health.`
    });
  } else if (savingsRate < 0) {
    suggestions.push({
      type: 'warning',
      emoji: '💸',
      message: `You're spending more than you earn this month. Consider reviewing your expenses and cutting unnecessary costs.`
    });
  }

  // Food spending suggestions
  const foodSpent = expensesByCategory['Food'] || 0;
  const foodLimit = currentLimits.find(l => l.category === 'Food');
  if (foodLimit && foodSpent > foodLimit.limit * 0.8) {
    suggestions.push({
      type: 'info',
      emoji: '🍽️',
      message: `Consider meal planning or cooking at home more often to manage your food expenses better.`,
      category: 'Food'
    });
  }

  return suggestions.slice(0, 4); // Limit to 4 suggestions to avoid overwhelming the user
};