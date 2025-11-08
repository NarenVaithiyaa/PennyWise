import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../../types';
import { getMonthlySavings } from '../../utils/calculations';

interface SavingsTrendsProps {
  expenses: Transaction[];
  income: Transaction[];
  selectedYear: number;
}

const SavingsTrends: React.FC<SavingsTrendsProps> = ({ expenses, income, selectedYear }) => {
  const savingsData = [];
  
  for (let i = 0; i < 12; i++) {
    const month = `${selectedYear}-${(i + 1).toString().padStart(2, '0')}`;
    const monthlySavings = getMonthlySavings(expenses, income, month);
    
    savingsData.push({
      month: new Date(selectedYear, i).toLocaleDateString('en-US', { month: 'short' }),
      savings: monthlySavings
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Savings Trends</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={savingsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="var(--chart-text-color)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--chart-text-color)"
              fontSize={12}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Savings']}
              labelStyle={{ color: 'var(--tooltip-text)' }}
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: '1px solid var(--tooltip-border)',
                color: 'var(--tooltip-text)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="savings"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Average Monthly Savings</p>
          <p className="text-lg font-semibold text-blue-600">
            ₹{(savingsData.reduce((sum, data) => sum + data.savings, 0) / 12).toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Best Savings Month</p>
          <p className="text-lg font-semibold text-green-600">
            {savingsData.reduce((best, current) => 
              current.savings > best.savings ? current : best
            ).month}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavingsTrends;