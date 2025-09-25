import type { ReactElement, CSSProperties, FC, HTMLAttributes } from "react";

export type RateIcon = "star" | "heart" | ReactElement;

export interface RateProps extends HTMLAttributes<HTMLDivElement> {
  count?: number;
  allowHalf?: boolean;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  showValue?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  testId?: string;
  icon?: RateIcon;
}

declare const Rate: FC<RateProps>;

export default Rate;
