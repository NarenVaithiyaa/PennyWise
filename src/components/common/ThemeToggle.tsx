import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <label className="switch">
      <input 
        type="checkbox" 
        checked={isDarkMode}
        onChange={toggleDarkMode}
      />
      <span className="slider"></span>
    </label>
  );
};

export default ThemeToggle;