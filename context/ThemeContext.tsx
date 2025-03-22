
import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    console.log('Toggling theme. Current mode:', isDarkMode ? 'Dark' : 'Light'); // Debug log
    setIsDarkMode((prevMode) => !prevMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode
      ? {
          background: '#121212',
          text: '#ffffff',
          headerBackground: '#1f1f1f',
          headerText: '#ffffff',
          cardBackground: '#1e1e1e',
          cardText: '#ffffff',
          border: '#333333',
          buttonBackground: 'orange', 
          buttonText: '#ffffff', 
        }
      : {
          background: '#ffffff',
          text: '#000000',
          headerBackground: '#007bff',
          headerText: '#ffffff',
          cardBackground: '#f5f5f5',
          cardText: '#000000',
          border: '#cccccc',
          buttonBackground: 'green', 
          buttonText: '#ffffff', 
        },
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);