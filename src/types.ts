export interface Transaction {
  id?: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  source?: 'bank' | 'wallet'; // For expenses - where money comes from
  destination?: 'bank' | 'wallet'; // For income - where money goes to
}

export interface MonthlyData {
  month: string;
  total: number;
  byCategory: Record<string, number>;
}

export interface YearlyData {
  year: number;
  total: number;
  months: MonthlyData[];
  byCategory: Record<string, number>;
}

export interface AccountBalances {
  bank: number;
  wallet: number;
}

export interface ExpenseLimit {
  category: string;
  limit: number;
  month: string; // Format: YYYY-MM
}

export interface SpendingSuggestion {
  type: 'warning' | 'praise' | 'info';
  message: string;
  emoji: string;
  category?: string;
}