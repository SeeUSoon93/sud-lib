"use client";

import { ThemeProvider } from "../theme/ThemeContext";
import { ToastRoot } from "./feedback/ToastRoot";
import { NotificationRoot } from "./feedback/NotificationRoot";

export const SoonUIDesign = ({ children, theme, darkTheme, isDarkMode }) => {
  return (
    <ThemeProvider theme={theme} darkTheme={darkTheme} isDarkMode={isDarkMode}>
      {children}
      <ToastRoot />
      <NotificationRoot />
    </ThemeProvider>
  );
};
