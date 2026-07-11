import type {
  ReactNode,
  CSSProperties,
  FC,
  ForwardRefExoticComponent,
  InputHTMLAttributes,
  RefAttributes
} from "react";
import type { defaultColorType } from "../commonType";

export type RadioLabelPosition = "left" | "right" | "top" | "bottom";
export type RadioDirection = "horizontal" | "vertical";

export interface RadioOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "onChange"
    | "checked"
    | "defaultChecked"
    | "color"
    | "style"
    | "className"
  > {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  labelPosition?: RadioLabelPosition;
  children?: ReactNode;
  color?: string;
  disabled?: boolean;
  colorType?: defaultColorType;
  style?: CSSProperties;
  className?: string;
  ariaLabel?: string;
  ariaRequired?: boolean;
  name?: string;
}

export interface RadioGroupProps {
  options?: RadioOption[];
  value?: string | number | null;
  onChange?: (value: string | number) => void;
  layout?: "flex" | "grid";
  direction?: RadioDirection;
  cols?: number;
  gap?: number;
  disabled?: boolean;
  itemDisabled?: (string | number)[];
  color?: string;
  colorType?: defaultColorType;
  labelPosition?: RadioLabelPosition;
  ariaLabel?: string;
  ariaRequired?: boolean;
  name?: string;
  style?: CSSProperties;
  className?: string;
}

declare const Radio: ForwardRefExoticComponent<
  RadioProps & RefAttributes<HTMLInputElement>
> & {
  Group: FC<RadioGroupProps>;
};

export default Radio;
