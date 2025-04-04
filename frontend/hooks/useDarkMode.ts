import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setEnabled(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setEnabled(isDark);
  };

  return { enabled, toggleDarkMode };
};
