"use client";

import React, { createContext, useContext, useEffect } from "react";
import { defaultTheme } from "./defaultTheme";
import { darkTheme as defaultDarkTheme } from "./darkTheme";
import { resolveColor } from "./themeUtils";
// ThemeContext 생성
export const ThemeContext = createContext(null);

// useTheme 훅
export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    return defaultTheme;
  }
  return theme;
};

/**
 * ThemeProvider 컴포넌트
 *
 * @param {Object} props
 * @param {Object} props.theme - 사용자 지정 테마 (기본 테마 확장)
 * @param {Object} props.darkTheme - 사용자 지정 다크 테마
 * @param {boolean} props.isDarkMode - 다크 모드 활성 여부
 * @param {React.ReactNode} props.children - 자식 요소
 */
export const ThemeProvider = ({
  theme = defaultTheme,
  darkTheme = defaultDarkTheme,
  isDarkMode = false,
  children
}) => {
  const activeTheme = isDarkMode ? darkTheme : theme;

  // body 배경색 설정
  useEffect(() => {
    document.body.style.backgroundColor = resolveColor(
      activeTheme.body.backgroundColor,
      activeTheme
    );
    document.body.style.color = resolveColor(
      activeTheme.body.color,
      activeTheme
    );
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={activeTheme}>
      {children}
    </ThemeContext.Provider>
  );
};
