import { InputProps } from "./Input";
import { PopConfirmProps } from "../feedback/PopConfirm";
import { TimeSelectorProps } from "./TimeSelector";
import {
  defaultColorType,
  shapeType,
  shadowType,
  borderType
} from "../commonType";

export type TimePickerSize = "sm" | "md" | "lg";

export type TimePickerPlacement = "top" | "bottom" | "left" | "right";

export interface TimePickerValue {
  startTime?: Date;
  endTime?: Date;
}

export interface TimePickerProps {
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 모양 */
  shape?: shapeType;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 크기 */
  size?: TimePickerSize;
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
  value?: Date | TimePickerValue;
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: Date | TimePickerValue, text: string) => void;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 시간 형식 */
  format?: string;
  /** 범위 선택 여부 */
  range?: boolean;
  /** 팝업 위치 */
  placement?: TimePickerPlacement;
  /** 초 표시 여부 */
  showSecond?: boolean;
  /** 12시간 형식 사용 여부 */
  use12Hours?: boolean;
  /** 시간 단계 */
  step?: number;
  /** 팝업 확인 props */
  popConfirmProps?: Partial<PopConfirmProps>;
  /** 입력 필드 props */
  inputProps?: Partial<InputProps>;
  /** 시간 선택기 props */
  timePickerProps?: Partial<TimeSelectorProps>;
  /** 고유 ID */
  id?: string;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 필수 입력 여부 */
  ariaRequired?: boolean;
  /** 유효하지 않음 여부 */
  ariaInvalid?: boolean;
  /** 설명 ID */
  ariaDescribedby?: string;
  /** 배경색 */
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

declare const TimePicker: React.FC<TimePickerProps>;
export default TimePicker;
