import React, { useMemo, useState } from 'react';
import { Transaction, ExpenseLimit } from '../../types';
import TransactionForm from '../common/TransactionForm';
import TransactionList from '../common/TransactionList';
import DateSelector from '../common/DateSelector';
import SearchAndFilter from '../common/SearchAndFilter';
import ExpenseLimits from './ExpenseLimits';
import { EXPENSE_CATEGORIES } from '../../constants';
import { getCurrentMonth, getCurrentYear, filterByMonth } from '../../utils/calculations';
import { exportToCSV } from '../../utils/storage';
import { ArrowUp } from 'lucide-react';

interface ExpenseTrackerProps {
  expenses: Transaction[];
  expenseLimits: ExpenseLimit[];
  onAddExpense: (expense: Transaction) => void;
  onUpdateExpense: (id: string, expense: Transaction) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateExpenseLimits: (limits: ExpenseLimit[]) => void;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  expenseLimits,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onUpdateExpenseLimits
}) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const expenseCategories = useMemo(
    () => Array.from(new Set([...EXPENSE_CATEGORIES, 'Others'])),
    []
  );

  const filteredExpenses = expenses.filter(expense => {
    const matchesMonth = expense.date.slice(0, 7) === selectedMonth;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || expense.category === selectedCategory;
    
    return matchesMonth && matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    const monthlyExpenses = filterByMonth(expenses, selectedMonth);
    exportToCSV(monthlyExpenses, `expenses-${selectedMonth}.csv`);
  };

  const handleAddExpense = (expenseData: Omit<Transaction, 'id' | 'type'>) => {
    onAddExpense({ ...expenseData, type: 'expense' } as Transaction);
  };

  const handleUpdateExpense = (id: string, expenseData: Omit<Transaction, 'id' | 'type'>) => {
    onUpdateExpense(id, { ...expenseData, type: 'expense' } as Transaction);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Tracker</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Track and manage your expenses with smart limits</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <DateSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
          >
            <ArrowUp className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <TransactionForm
            onSubmit={handleAddExpense}
            categories={expenseCategories}
            type="expense"
          />
          
          <ExpenseLimits
            expenseLimits={expenseLimits}
            onUpdateExpenseLimits={onUpdateExpenseLimits}
            selectedMonth={selectedMonth}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={expenseCategories}
            placeholder="Search expenses..."
          />

          <TransactionList
            transactions={filteredExpenses}
            onUpdate={handleUpdateExpense}
            onDelete={onDeleteExpense}
            categories={expenseCategories}
            type="expense"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;