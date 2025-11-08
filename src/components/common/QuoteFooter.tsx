import React from 'react';

const QuoteFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 font-bold italic text-base">
            "It's not the man who has little that is poor, but the man who craves more, that is poor"
          </p>
        </div>
      </div>
    </footer>
  );
};

export default QuoteFooter;