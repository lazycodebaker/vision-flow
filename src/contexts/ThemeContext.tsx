
import React, { createContext, useState, useEffect } from "react";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState(true);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("visionflow-theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      // Default to dark theme
      setIsDark(true);
      localStorage.setItem("visionflow-theme", "dark");
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark-theme");
      document.documentElement.classList.remove("light-theme");
      localStorage.setItem("visionflow-theme", "dark");
    } else {
      document.documentElement.classList.add("light-theme");
      document.documentElement.classList.remove("dark-theme");
      localStorage.setItem("visionflow-theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};