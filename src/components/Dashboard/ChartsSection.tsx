import React, { useState } from 'react';
import { Transaction } from '../../types';
import ExpenseChart from '../Charts/ExpenseChart';
import IncomeChart from '../Charts/IncomeChart';
import TrendsChart from '../Charts/TrendsChart';

interface ChartsSectionProps {
  expenses: Transaction[];
  income: Transaction[];
  selectedMonth: string;
  selectedYear: number;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  expenses,
  income,
  selectedMonth,
  selectedYear
}) => {
  const [chartView, setChartView] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics</h2>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-full sm:w-auto">
          <button
            onClick={() => setChartView('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              chartView === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setChartView('yearly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              chartView === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart
          expenses={expenses}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          view={chartView}
        />
        <IncomeChart
          income={income}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          view={chartView}
        />
      </div>

      <TrendsChart
        expenses={expenses}
        income={income}
        selectedYear={selectedYear}
      />
    </div>
  );
};

export default ChartsSection;