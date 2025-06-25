import { ReactNode } from "react";

export type TimeSelectorColorType = "sky" | "hovered";

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

export interface TimeSelectorProps {
  /** 현재 값 */
  value?: Date | TimeSelectorValue;
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: Date | TimeSelectorValue) => void;
  /** 범위 선택 여부 */
  range?: boolean;
  /** 12시간 형식 사용 여부 */
  use12Hours?: boolean;
  /** 초 표시 여부 */
  showSecond?: boolean;
  /** 시간 단계 */
  step?: number;
  /** 색상 타입 */
  colorType?: TimeSelectorColorType;
  /** 호버 색상 타입 */
  hoverColorType?: TimeSelectorColorType;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const TimeSelector: React.FC<TimeSelectorProps>;
export default TimeSelector;
