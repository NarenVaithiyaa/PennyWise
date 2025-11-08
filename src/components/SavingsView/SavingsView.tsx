import React, { useState } from 'react';
import { Transaction } from '../../types';
import SavingsOverview from './SavingsOverview';
import SavingsGoals from './SavingsGoals';
import SavingsTrends from './SavingsTrends';
import DateSelector from '../common/DateSelector';
import { getCurrentMonth, getCurrentYear } from '../../utils/calculations';

interface SavingsViewProps {
  expenses: Transaction[];
  income: Transaction[];
}

const SavingsView: React.FC<SavingsViewProps> = ({ expenses, income }) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Savings Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Monitor your savings progress and set goals</p>
        </div>
        <div className="w-full sm:w-auto">
          <DateSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </div>
      </div>

      <SavingsOverview
        expenses={expenses}
        income={income}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SavingsGoals
          expenses={expenses}
          income={income}
          selectedMonth={selectedMonth}
        />
        <SavingsTrends
          expenses={expenses}
          income={income}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
};

export default SavingsView;