import { ReactNode, MouseEvent } from "react";
import { shapeType, borderType, shadowType } from "../commonType";

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

export interface InputProps {
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
  /** 후위 아이콘 */
  afterIcon?: ReactNode;
  /** 전위 아이콘 */
  beforeIcon?: ReactNode;
  /** 접두사 */
  prefix?: ReactNode;
  /** 접미사 */
  suffix?: ReactNode;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 읽기 전용 여부 */
  readOnly?: boolean;
  /** 자동 포커스 여부 */
  autoFocus?: boolean;
  /** 최대 길이 */
  maxLength?: number;
  /** 비밀번호 입력 여부 */
  password?: boolean;
  /** 입력 타입 */
  type?: InputType;
  /** 지우기 버튼 표시 여부 */
  clearable?: boolean;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 현재 값 */
  value?: string;
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (e: { target: { value: string } }) => void;
  /** 모양 (rounded | square | capsule) */
  shape?: shapeType;
  /** 그림자 효과 (none | sm | md | lg) */
  shadow?: shadowType;
  /** 크기 */
  size?: InputSize;
  /** 고유 ID */
  id?: string;
  /** 이름 */
  name?: string;
  /** 자동 완성 */
  autoComplete?: string;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 레이블 */
  label?: ReactNode;
  /** 에러 메시지 */
  errorText?: string;
  /** 에러 상태 */
  error?: boolean;
  /** 필수 입력 여부 */
  required?: boolean;
  /** 접근성 필수 입력 여부 */
  ariaRequired?: boolean;
  /** 접근성 유효하지 않음 여부 */
  ariaInvalid?: boolean;
  /** 접근성 설명 ID */
  ariaDescribedby?: string;
  /** 클릭 시 호출되는 콜백 */
  onClick?: (e: MouseEvent) => void;
  /** 천 단위 구분자 여부 */
  thousandSeparator?: boolean;
}

export interface TextareaProps
  extends Omit<InputProps, "type" | "password" | "clearable"> {
  /** 행 수 */
  rows?: number;
  /** 크기 조절 가능 여부 */
  resizable?: boolean;
  /** 자동 크기 조절 여부 */
  autoSize?: boolean;
  /** 하단 왼쪽 요소 */
  bottomLeft?: ReactNode;
  /** 하단 오른쪽 요소 */
  bottomRight?: ReactNode;
  /** 모양 (rounded | square) */
  shape?: shapeType;
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
  > {
  /** OTP 타입 */
  type?: "int" | "text";
  /** OTP 길이 */
  length?: number;
}

declare const Input: React.FC<InputProps>;
declare const Textarea: React.FC<TextareaProps>;
declare const OTP: React.FC<OTPProps>;

export { Textarea, OTP };
export default Input;
