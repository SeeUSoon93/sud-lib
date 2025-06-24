import { PopConfirmProps } from "../feedback/PopConfirm";
import { CalendarProps } from "../dataDisplay/Calendar";
import { InputProps } from "./Input";
import {
  defaultColorType,
  shapeType,
  shadowType,
  borderType
} from "../commonType";

export type DatePickerSize = "sm" | "md" | "lg";
export type DatePickerPlacement = "top" | "bottom" | "left" | "right";

export interface DatePickerValue {
  startDate?: Date;
  endDate?: Date;
}

export interface DatePickerProps {
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 모양 */
  shape?: shapeType;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 크기 */
  size?: DatePickerSize;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 읽기 전용 여부 */
  readOnly?: boolean;
  /** 에러 상태 */
  error?: boolean;
  /** 에러 메시지 */
  errorText?: string;
  /** 추가 클래스명 */
  className?: string;
  /** 현재 값 */
  value?: Date | DatePickerValue;
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: Date | DatePickerValue, text: string) => void;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 날짜 형식 */
  format?: string;
  /** 범위 선택 여부 */
  range?: boolean;
  /** 팝업 위치 */
  placement?: DatePickerPlacement;
  /** 로케일 */
  locale?: "en" | "ko";
  /** 팝업 속성 */
  popConfirmProps?: Partial<PopConfirmProps>;
  /** 입력 필드 속성 */
  inputProps?: Partial<InputProps>;
  /** 캘린더 속성 */
  calendarProps?: Partial<CalendarProps>;
  /** 고유 ID */
  id?: string;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 접근성 필수 입력 여부 */
  ariaRequired?: boolean;
  /** 접근성 유효하지 않음 여부 */
  ariaInvalid?: boolean;
  /** 접근성 설명 ID */
  ariaDescribedby?: string /** 배경색 */;
  background?: string;
  /** 텍스트 색상 */
  color?: string;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 테두리 색상 */
  borderColor?: string;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 두께 */
  borderWeight?: number;
  /** 밑줄 스타일 여부 */
  underline?: boolean;
}

declare const DatePicker: React.FC<DatePickerProps>;
export default DatePicker;
