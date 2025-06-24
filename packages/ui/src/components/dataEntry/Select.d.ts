import { ReactNode } from "react";
import {
  defaultColorType,
  defaultSizeType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
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
  /** 전위 아이콘 */
  beforeIcon?: ReactNode;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 현재 값 */
  value?: string | string[];
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: string | string[]) => void;
  /** 모양 */
  shape?: shapeType;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 크기 */
  size?: defaultSizeType;
  /** 고유 ID */
  id?: string;
  /** 태그 색상 타입 */
  tagColorType?: defaultColorType;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 레이블 */
  label?: ReactNode;
  /** 에러 메시지 */
  errorText?: string;
  /** 에러 상태 */
  error?: boolean;
  /** 지우기 버튼 표시 여부 */
  clearable?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 읽기 전용 여부 */
  readOnly?: boolean;
  /** 드롭다운 스타일 */
  dropdownStyle?: React.CSSProperties;
  /** 검색 가능 여부 */
  searchable?: boolean;
  /** 다중 선택 모드 여부 */
  multiMode?: boolean;
  /** 선택된 항목 개수 표시 여부 */
  showSelectedCount?: boolean;
  /** 옵션 목록 */
  options?: SelectOption[];
  /** 플레이스홀더 */
  placeholder?: string;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 접근성 필수 입력 여부 */
  ariaRequired?: boolean;
  /** 접근성 유효하지 않음 여부 */
  ariaInvalid?: boolean;
  /** 접근성 설명 ID */
  ariaDescribedby?: string;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Select: React.FC<SelectProps>;
export default Select;
