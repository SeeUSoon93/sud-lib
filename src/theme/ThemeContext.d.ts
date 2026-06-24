import type { Context, FC, ReactNode } from "react";

export type ThemeScale = Record<string | number, string>;

export interface ComponentColorToken {
  bg?: string;
  txt?: string;
  border?: string;
  separator?: string;
  text?: string;
  now?: string;
  [key: string]: unknown;
}

export interface SUDTheme {
  body?: {
    backgroundColor?: string;
    color?: string;
    [key: string]: unknown;
  };
  colors?: Record<string, ThemeScale>;
  components?: Record<string, Record<string, ComponentColorToken>>;
  typography?: {
    fontSize?: Record<string, string>;
    fontWeight?: Record<string, string | number>;
    [key: string]: unknown;
  };
  shadows?: Record<string, string>;
  shapes?: Record<string, Record<string, string | number>>;
  [key: string]: unknown;
}

export interface ThemeProviderProps {
  theme?: SUDTheme;
  darkTheme?: SUDTheme;
  isDarkMode?: boolean;
  children?: ReactNode;
}

export declare const ThemeContext: Context<SUDTheme | null>;
export declare const useTheme: () => SUDTheme;
export declare const ThemeProvider: FC<ThemeProviderProps>;
