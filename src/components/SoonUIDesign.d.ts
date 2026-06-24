import type { FC, ReactNode } from "react";

export type SoonUITheme = Record<string, unknown>;

export interface SoonUIDesignProps {
  children?: ReactNode;
  theme?: SoonUITheme;
  darkTheme?: SoonUITheme;
  isDarkMode?: boolean;
}

export declare const SoonUIDesign: FC<SoonUIDesignProps>;
