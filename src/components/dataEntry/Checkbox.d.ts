import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type { defaultColorType } from "../commonType";

export type CheckboxLabelPosition = "left" | "right" | "top" | "bottom";
export type CheckboxDirection = "horizontal" | "vertical";

export interface CheckboxOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
}

export interface CheckboxProps
  extends Omit<HTMLAttributes<HTMLLabelElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  labelPosition?: CheckboxLabelPosition;
  children?: ReactNode;
  color?: string;
  disabled?: boolean;
  colorType?: defaultColorType;
  style?: CSSProperties;
  className?: string;
  ariaLabel?: string;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
}

export interface CheckboxGroupProps {
  options?: CheckboxOption[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  layout?: "flex" | "grid";
  direction?: CheckboxDirection;
  cols?: number;
  gap?: number;
  disabled?: boolean;
  itemDisabled?: (string | number)[];
  color?: string;
  colorType?: defaultColorType;
  labelPosition?: CheckboxLabelPosition;
  ariaLabel?: string;
  ariaRequired?: boolean;
  name?: string;
  role?: string;
  style?: CSSProperties;
  className?: string;
}

declare const Checkbox: FC<CheckboxProps> & {
  Group: FC<CheckboxGroupProps>;
};

export default Checkbox;
