import React, { useState } from 'react';
import { Transaction, AccountBalances, ExpenseLimit } from '../../types';
import DailySummary from './DailySummary';
import SummaryCards from './SummaryCards';
import ChartsSection from './ChartsSection';
import RecentTransactions from './RecentTransactions';
import AccountBalancesComponent from './AccountBalances';
import SpendingSuggestions from './SpendingSuggestions';
import DateSelector from '../common/DateSelector';
import { getCurrentMonth, getCurrentYear } from '../../utils/calculations';

interface DashboardProps {
  expenses: Transaction[];
  income: Transaction[];
  balances: AccountBalances;
  expenseLimits: ExpenseLimit[];
  onUpdateBalances: (balances: AccountBalances) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  expenses, 
  income, 
  balances, 
  expenseLimits,
  onUpdateBalances 
}) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Overview of your financial activity</p>
        </div>
        <DateSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      <DailySummary
        expenses={expenses}
        income={income}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SummaryCards
            expenses={expenses}
            income={income}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
          <SpendingSuggestions
            expenses={expenses}
            income={income}
            expenseLimits={expenseLimits}
            selectedMonth={selectedMonth}
          />
        </div>
        <AccountBalancesComponent
          balances={balances}
          onUpdateBalances={onUpdateBalances}
        />
      </div>

      <ChartsSection
        expenses={expenses}
        income={income}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      <RecentTransactions
        expenses={expenses}
        income={income}
      />
    </div>
  );
};

export default Dashboard;