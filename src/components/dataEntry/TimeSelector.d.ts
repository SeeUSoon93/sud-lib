import type { FC, HTMLAttributes } from "react";
import type { defaultColorType } from "../commonType";

export interface TimeSelectorTime {
  hour: number | null;
  minute: number | null;
  second: number | null;
  ampm: "AM" | "PM";
}

export interface TimeSelectorValue {
  startTime?: Date;
  endTime?: Date;
}

export interface TimeSelectorProps extends HTMLAttributes<HTMLDivElement> {
  value?: Date | TimeSelectorValue;
  onChange?: (value: Date | TimeSelectorValue) => void;
  range?: boolean;
  use12Hours?: boolean;
  showSecond?: boolean;
  step?: number;
  colorType?: defaultColorType;
  hoverColorType?: defaultColorType;
}

declare const TimeSelector: FC<TimeSelectorProps>;
export default TimeSelector;
