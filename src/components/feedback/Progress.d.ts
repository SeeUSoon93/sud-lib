import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type { tagColorType } from "../commonType";

export type ProgressType = "bar" | "circle" | "dashboard";
export type ProgressSize = "sm" | "md" | "lg";

export type ProgressValuePosition =
  | "inside-start"
  | "inside-center"
  | "inside-end"
  | "outside-left"
  | "outside-right";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  type?: ProgressType;
  value?: number;
  max?: number;
  unit?: string;
  showText?: boolean;
  iconWhenFull?: ReactNode;
  iconWhenNotFull?: ReactNode;
  colorType?: tagColorType;
  backgroundColor?: string;
  color?: string;
  valuePosition?: ProgressValuePosition;
  size?: ProgressSize;
  fontSize?: number;
  className?: string;
  style?: CSSProperties;
}

declare const Progress: FC<ProgressProps>;
export default Progress;
