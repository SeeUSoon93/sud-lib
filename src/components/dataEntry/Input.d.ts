import type {
  ReactNode,
  CSSProperties,
  FC,
  HTMLAttributes,
  MouseEvent,
  KeyboardEvent,
  ChangeEvent
} from "react";
import type { shapeType, borderType, shadowType } from "../commonType";

export type InputSize = "sm" | "md" | "lg";

export type InputType =
  | "text"
  | "password"
  | "number"
  | "int"
  | "email"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "datetime-local"
  | "time"
  | "week"
  | "month"
  | "color"
  | "file"
  | "range"
  | "hidden"
  | "image"
  | "radio"
  | "checkbox"
  | "submit"
  | "reset"
  | "button";

export interface InputProps
  extends Omit<
    HTMLAttributes<HTMLInputElement>,
    "onChange" | "onClick" | "onKeyDown"
  > {
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  underline?: boolean;
  afterIcon?: ReactNode;
  beforeIcon?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  password?: boolean;
  type?: InputType;
  clearable?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  shape?: shapeType;
  shadow?: shadowType;
  size?: InputSize;
  id?: string;
  name?: string;
  autoComplete?: string;
  ariaLabel?: string;
  label?: ReactNode;
  errorText?: string;
  error?: boolean;
  required?: boolean;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  thousandSeparator?: boolean;
}

export interface TextareaProps
  extends Omit<
    InputProps,
    | "type"
    | "password"
    | "clearable"
    | "thousandSeparator"
    | "prefix"
    | "suffix"
    | "afterIcon"
    | "beforeIcon"
  > {
  rows?: number;
  resizable?: boolean;
  autoSize?: boolean;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
  spellCheck?: boolean;
}

export interface OTPProps
  extends Omit<
    InputProps,
    | "type"
    | "password"
    | "clearable"
    | "prefix"
    | "suffix"
    | "afterIcon"
    | "beforeIcon"
    | "thousandSeparator"
  > {
  type?: "int" | "text";
  length?: number;
}

declare const Input: FC<InputProps> & {
  Textarea: FC<TextareaProps>;
  OTP: FC<OTPProps>;
};

export default Input;
