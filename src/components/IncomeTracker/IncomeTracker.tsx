import React, { useMemo, useState } from 'react';
import { Transaction } from '../../types';
import TransactionForm from '../common/TransactionForm';
import TransactionList from '../common/TransactionList';
import DateSelector from '../common/DateSelector';
import SearchAndFilter from '../common/SearchAndFilter';
import { INCOME_CATEGORIES } from '../../constants';
import { getCurrentMonth, getCurrentYear, filterByMonth } from '../../utils/calculations';
import { exportToCSV } from '../../utils/storage';
import { ArrowUp } from 'lucide-react';

interface IncomeTrackerProps {
  income: Transaction[];
  onAddIncome: (income: Transaction) => void;
  onUpdateIncome: (id: string, income: Transaction) => void;
  onDeleteIncome: (id: string) => void;
}

const IncomeTracker: React.FC<IncomeTrackerProps> = ({
  income,
  onAddIncome,
  onUpdateIncome,
  onDeleteIncome
}) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const incomeCategories = useMemo(
    () => Array.from(new Set([...INCOME_CATEGORIES, 'Others'])),
    []
  );

  const filteredIncome = income.filter(incomeItem => {
    const matchesMonth = incomeItem.date.slice(0, 7) === selectedMonth;
    const matchesSearch = incomeItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incomeItem.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || incomeItem.category === selectedCategory;
    
    return matchesMonth && matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    const monthlyIncome = filterByMonth(income, selectedMonth);
    exportToCSV(monthlyIncome, `income-${selectedMonth}.csv`);
  };

  const handleAddIncome = (incomeData: Omit<Transaction, 'id' | 'type'>) => {
    onAddIncome({ ...incomeData, type: 'income' } as Transaction);
  };

  const handleUpdateIncome = (id: string, incomeData: Omit<Transaction, 'id' | 'type'>) => {
    onUpdateIncome(id, { ...incomeData, type: 'income' } as Transaction);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Income Tracker</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Track and manage your income sources</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
          <DateSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <ArrowUp className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TransactionForm
            onSubmit={handleAddIncome}
            categories={incomeCategories}
            type="income"
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={incomeCategories}
            placeholder="Search income..."
          />

          <TransactionList
            transactions={filteredIncome}
            onUpdate={handleUpdateIncome}
            onDelete={onDeleteIncome}
            categories={incomeCategories}
            type="income"
          />
        </div>
      </div>
    </div>
  );
};

export default IncomeTracker;