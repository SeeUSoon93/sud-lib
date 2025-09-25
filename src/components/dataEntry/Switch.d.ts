import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type { defaultColorType, shadowType } from "../commonType";

export interface SwitchProps extends HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  onColor?: string;
  offColor?: string;
  onText?: ReactNode;
  offText?: ReactNode;
  onIcon?: ReactNode;
  offIcon?: ReactNode;
  thumbColor?: string;
  shadow?: shadowType;
  size?: "sm" | "md" | "lg";
  colorType?: defaultColorType;
  className?: string;
  style?: CSSProperties;
  id?: string;
  ariaLabel?: string;
}

declare const Switch: FC<SwitchProps>;
export default Switch;
