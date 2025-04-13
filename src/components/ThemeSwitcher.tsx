
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ThemeSwitcherProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isDark, toggleTheme }) => {
  return (
    <div className="flex items-center space-x-2">
      <Sun size={16} className={`${isDark ? 'text-gray-500' : 'text-yellow-400'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-gray-700 data-[state=unchecked]:bg-gray-300"
      />
      <Moon size={16} className={`${isDark ? 'text-blue-300' : 'text-gray-400'}`} />
    </div>
  );
};

export default ThemeSwitcher;
