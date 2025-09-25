import type { CSSProperties, FC } from "react";
import type { PopConfirmProps } from "../feedback/PopConfirm";
import type { PopupPlacement } from "../navigation/base/PopupBase";
import type { CalendarProps } from "../dataDisplay/Calendar";
import type { InputProps } from "./Input";
import type {
  defaultColorType,
  shapeType,
  shadowType,
  borderType
} from "../commonType";

export type DatePickerSize = "sm" | "md" | "lg";

export interface DatePickerValue {
  startDate?: Date;
  endDate?: Date;
}

export interface DatePickerProps {
  colorType?: defaultColorType;
  shape?: shapeType;
  shadow?: shadowType;
  size?: DatePickerSize;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  errorText?: string;
  className?: string;
  value?: Date | DatePickerValue;
  onChange?: (value: Date | DatePickerValue, text: string) => void;
  placeholder?: string;
  format?: string;
  range?: boolean;
  placement?: PopupPlacement;
  locale?: "en" | "ko";
  popConfirmProps?: Partial<PopConfirmProps>;
  inputProps?: Partial<InputProps>;
  calendarProps?: Partial<CalendarProps>;
  id?: string;
  ariaLabel?: string;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  underline?: boolean;
  style?: CSSProperties;
}

declare const DatePicker: FC<DatePickerProps>;
export default DatePicker;
