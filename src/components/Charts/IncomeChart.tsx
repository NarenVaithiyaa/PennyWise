import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '../../types';
import { filterByMonth, filterByYear, getAmountByCategory } from '../../utils/calculations';
import { CHART_COLORS } from '../../constants';

interface IncomeChartProps {
  income: Transaction[];
  selectedMonth: string;
  selectedYear: number;
  view: 'monthly' | 'yearly';
}

const IncomeChart: React.FC<IncomeChartProps> = ({
  income,
  selectedMonth,
  selectedYear,
  view
}) => {
  const filteredIncome = view === 'monthly' 
    ? filterByMonth(income, selectedMonth)
    : filterByYear(income, selectedYear);

  const categoryData = getAmountByCategory(filteredIncome);
  
  const chartData = Object.entries(categoryData).map(([category, amount], index) => ({
    name: category,
    value: amount,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {view === 'monthly' ? 'Monthly' : 'Yearly'} Income by Category
        </h3>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No income data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {view === 'monthly' ? 'Monthly' : 'Yearly'} Income by Category
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: '1px solid var(--tooltip-border)',
                color: 'var(--tooltip-text)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span style={{ color: 'var(--legend-text)', fontSize: '14px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeChart;