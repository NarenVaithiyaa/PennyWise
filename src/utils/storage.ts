import { Transaction, AccountBalances, ExpenseLimit } from '../types';

interface StorageData {
  expenses: Transaction[];
  income: Transaction[];
  balances: AccountBalances;
  expenseLimits: ExpenseLimit[];
}

export const loadData = (): StorageData => {
  try {
    const storedData = localStorage.getItem('financeData');
    if (storedData) {
      const data = JSON.parse(storedData);
      // Ensure all properties exist with default values
      return {
        expenses: data.expenses || [],
        income: data.income || [],
        balances: data.balances || { bank: 0, wallet: 0 },
        expenseLimits: data.expenseLimits || []
      };
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return { 
    expenses: [], 
    income: [], 
    balances: { bank: 0, wallet: 0 },
    expenseLimits: []
  };
};

export const saveData = (data: StorageData): void => {
  try {
    localStorage.setItem('financeData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const exportToCSV = (transactions: Transaction[], filename: string): void => {
  const headers = ['Date', 'Category', 'Amount', 'Description', 'Source/Destination'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      t.date,
      t.category,
      t.amount.toString(),
      `"${t.description}"`,
      t.source || t.destination || ''
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};