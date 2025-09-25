import type { CSSProperties, FC } from "react";
import type { InputProps } from "./Input";
import type { PopConfirmProps } from "../feedback/PopConfirm";
import type { PopupPlacement } from "../navigation/base/PopupBase";
import type { TimeSelectorProps } from "./TimeSelector";
import type {
  defaultColorType,
  shapeType,
  shadowType,
  borderType
} from "../commonType";

export type TimePickerSize = "sm" | "md" | "lg";

export interface TimePickerValue {
  startTime?: Date;
  endTime?: Date;
}

export interface TimePickerProps {
  colorType?: defaultColorType;
  shape?: shapeType;
  shadow?: shadowType;
  size?: TimePickerSize;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  errorText?: string;
  className?: string;
  value?: Date | TimePickerValue;
  onChange?: (value: Date | TimePickerValue, text: string) => void;
  placeholder?: string;
  format?: string;
  range?: boolean;
  placement?: PopupPlacement;
  showSecond?: boolean;
  use12Hours?: boolean;
  step?: number;
  popConfirmProps?: Partial<PopConfirmProps>;
  inputProps?: Partial<InputProps>;
  timePickerProps?: Partial<TimeSelectorProps>;
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

declare const TimePicker: FC<TimePickerProps>;
export default TimePicker;
