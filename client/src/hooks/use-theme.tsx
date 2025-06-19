import { useState, useEffect } from "react";

const themes = ["theme-dark", "theme-blue", "theme-purple", "theme-red"];

export function useTheme() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem("profile-theme");
    if (savedTheme) {
      const themeIndex = themes.findIndex(theme => theme === savedTheme);
      if (themeIndex !== -1) {
        setCurrentThemeIndex(themeIndex);
      }
    }
  }, []);

  const switchTheme = () => {
    const newIndex = (currentThemeIndex + 1) % themes.length;
    setCurrentThemeIndex(newIndex);
    const newTheme = themes[newIndex];
    localStorage.setItem("profile-theme", newTheme);
  };

  return {
    theme: themes[currentThemeIndex],
    switchTheme,
  };
}
