import type {
  ReactNode,
  CSSProperties,
  ForwardRefExoticComponent,
  InputHTMLAttributes,
  RefAttributes
} from "react";
import type { defaultColorType, shadowType } from "../commonType";

export interface SwitchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "onChange"
    | "checked"
    | "defaultChecked"
    | "color"
    | "size"
    | "style"
    | "className"
  > {
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

declare const Switch: ForwardRefExoticComponent<
  SwitchProps & RefAttributes<HTMLInputElement>
>;
export default Switch;
