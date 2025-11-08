import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '../../types';
import { getMonthlyTrends } from '../../utils/calculations';

interface TrendsChartProps {
  expenses: Transaction[];
  income: Transaction[];
  selectedYear: number;
}

const TrendsChart: React.FC<TrendsChartProps> = ({ expenses, income, selectedYear }) => {
  const expenseTrends = getMonthlyTrends(expenses, selectedYear);
  const incomeTrends = getMonthlyTrends(income, selectedYear);

  const combinedData = expenseTrends.map((expense, index) => ({
    month: expense.month,
    expenses: expense.amount,
    income: incomeTrends[index].amount,
    savings: incomeTrends[index].amount - expense.amount
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Financial Trends for {selectedYear}
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `₹${value.toFixed(2)}`,
                name.charAt(0).toUpperCase() + name.slice(1)
              ]}
              labelStyle={{ color: 'var(--tooltip-text)' }}
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: '1px solid var(--tooltip-border)',
                color: 'var(--tooltip-text)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="savings"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsChart;