import { ReactNode } from "react";

import { defaultColorType } from "../commonType";

export type CheckboxLabelPosition = "left" | "right" | "top" | "bottom";
export type CheckboxDirection = "horizontal" | "vertical";

export interface CheckboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface CheckboxProps {
  /** 체크박스의 체크 상태 */
  checked?: boolean;
  /** 초기 체크 상태 */
  defaultChecked?: boolean;
  /** 체크 상태 변경 시 호출되는 함수 */
  onChange?: (checked: boolean) => void;
  /** 라벨 위치 */
  labelPosition?: CheckboxLabelPosition;
  /** 체크박스 라벨 */
  children?: ReactNode;
  /** 체크박스 색상 */
  color?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 체크박스 색상 타입 */
  colorType?: defaultColorType;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 클래스명 */
  className?: string;
  /** ARIA 라벨 */
  ariaLabel?: string;
  /** ARIA 필수 여부 */
  ariaRequired?: boolean;
  /** ARIA 유효성 상태 */
  ariaInvalid?: boolean;
  /** ARIA 설명 ID */
  ariaDescribedby?: string;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

export interface CheckboxGroupProps {
  /** 옵션 목록 */
  options?: CheckboxOption[];
  /** 현재 값 */
  value?: (string | number)[];
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: (string | number)[]) => void;
  /** 레이아웃 방식 (flex 또는 grid) */
  layout?: "flex" | "grid";
  /** 방향 */
  direction?: CheckboxDirection;
  /** 열 개수 (가로 방향일 때 사용되며, 컨테이너 크기에 따라 자동으로 반응형으로 동작) */
  cols?: number;
  /** 간격 */
  gap?: number;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 항목별 비활성화 여부 */
  itemDisabled?: (value: string | number) => boolean;
  /** 색상 */
  color?: string;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 레이블 위치 */
  labelPosition?: CheckboxLabelPosition;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 접근성 필수 입력 여부 */
  ariaRequired?: boolean;
  /** 역할 */
  role?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Checkbox: React.FC<CheckboxProps> & {
  Group: React.FC<CheckboxGroupProps>;
};

export default Checkbox;
