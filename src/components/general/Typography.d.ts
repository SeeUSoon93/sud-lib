import type {
  ReactNode,
  CSSProperties,
  FC,
  HTMLAttributes,
  ElementType
} from "react";

export type PretendardWeight =
  | "T"
  | "EL"
  | "L"
  | "R"
  | "M"
  | "SB"
  | "B"
  | "Black";
export type GmarketWeight = "Light" | "Medium" | "Bold";
export type SuiteWeight = "L" | "R" | "M" | "SM" | "B" | "EB" | "H";
export type FontSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";
export type FontWeight = "light" | "normal" | "medium" | "semibold" | "bold";

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  pretendard?: PretendardWeight;
  gmarket?: GmarketWeight;
  suite?: SuiteWeight;
  code?: boolean;
  fontFamily?: string;
  size?: FontSize;
  weight?: FontWeight;
  as?: ElementType;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export declare const Typography: FC<TypographyProps>;
