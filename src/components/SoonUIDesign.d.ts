import type { FC, ReactNode } from "react";
import type { SUDTheme } from "../theme";

export interface SoonUIDesignProps {
  children?: ReactNode;
  theme?: SUDTheme;
  darkTheme?: SUDTheme;
  isDarkMode?: boolean;
}

export declare const SoonUIDesign: FC<SoonUIDesignProps>;
