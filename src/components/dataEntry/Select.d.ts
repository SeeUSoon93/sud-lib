import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType,
  tagColorType
} from "../commonType";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string | number;
  label: ReactNode;
}

export interface SelectProps extends HTMLAttributes<HTMLDivElement> {
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  underline?: boolean;
  beforeIcon?: ReactNode;
  afterIcon?: ReactNode;
  className?: string;
  style?: CSSProperties;
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[]) => void;
  shape?: shapeType;
  shadow?: shadowType;
  size?: SelectSize;
  id?: string;
  tagColorType?: tagColorType;
  colorType?: defaultColorType;
  label?: ReactNode;
  errorText?: string;
  error?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  dropdownStyle?: CSSProperties;
  searchable?: boolean;
  multiMode?: boolean;
  showSelectedCount?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
}

declare const Select: FC<SelectProps>;
export default Select;
