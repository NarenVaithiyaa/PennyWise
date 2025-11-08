import React from 'react';
import { Calendar } from 'lucide-react';

interface DateSelectorProps {
  selectedMonth: string;
  selectedYear: number;
  onMonthChange: (month: string) => void;
  onYearChange: (year: number) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange
}) => {
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleMonthChange = (monthValue: string) => {
    onMonthChange(`${selectedYear}-${monthValue}`);
  };

  const handleYearChange = (year: number) => {
    const monthValue = selectedMonth.split('-')[1];
    onMonthChange(`${year}-${monthValue}`);
    onYearChange(year);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      <select
        value={selectedMonth.split('-')[1]}
        onChange={(e) => handleMonthChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      >
        {months.map(month => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={(e) => handleYearChange(parseInt(e.target.value))}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      >
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;