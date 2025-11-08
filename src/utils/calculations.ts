import { Transaction } from '../types';

export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7);
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const filterByMonth = (transactions: Transaction[], month: string): Transaction[] => {
  return transactions.filter(t => t.date.slice(0, 7) === month);
};

export const filterByYear = (transactions: Transaction[], year: number): Transaction[] => {
  return transactions.filter(t => new Date(t.date).getFullYear() === year);
};

export const filterByDate = (transactions: Transaction[], date: string): Transaction[] => {
  return transactions.filter(t => t.date === date);
};

export const getTotalAmount = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
};

export const getAmountByCategory = (transactions: Transaction[]): Record<string, number> => {
  return transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
};

export const getMonthlySavings = (expenses: Transaction[], income: Transaction[], month: string): number => {
  const monthlyExpenses = getTotalAmount(filterByMonth(expenses, month));
  const monthlyIncome = getTotalAmount(filterByMonth(income, month));
  return monthlyIncome - monthlyExpenses;
};

export const getDailySavings = (expenses: Transaction[], income: Transaction[], date: string): number => {
  const dailyExpenses = getTotalAmount(filterByDate(expenses, date));
  const dailyIncome = getTotalAmount(filterByDate(income, date));
  return dailyIncome - dailyExpenses;
};

export const getYearlySavings = (expenses: Transaction[], income: Transaction[], year: number): number => {
  const yearlyExpenses = getTotalAmount(filterByYear(expenses, year));
  const yearlyIncome = getTotalAmount(filterByYear(income, year));
  return yearlyIncome - yearlyExpenses;
};

export const getSavingsRate = (savings: number, income: number): number => {
  return income > 0 ? (savings / income) * 100 : 0;
};

export const getMonthlyTrends = (transactions: Transaction[], year: number): Array<{month: string; amount: number}> => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const month = `${year}-${(i + 1).toString().padStart(2, '0')}`;
    const monthlyTransactions = filterByMonth(transactions, month);
    months.push({
      month: new Date(year, i).toLocaleDateString('en-US', { month: 'short' }),
      amount: getTotalAmount(monthlyTransactions)
    });
  }
  return months;
};