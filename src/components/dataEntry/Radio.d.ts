import { ReactNode } from "react";
import { defaultColorType } from "../commonType";

export type RadioLabelPosition = "left" | "right" | "top" | "bottom";
export type RadioDirection = "horizontal" | "vertical";

export interface RadioOption {
  value: string | number;
  label: ReactNode;
}

export interface RadioProps {
  /** 체크 상태 */
  checked?: boolean;
  /** 기본 체크 상태 */
  defaultChecked?: boolean;
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (checked: boolean) => void;
  /** 레이블 위치 */
  labelPosition?: RadioLabelPosition;
  /** 자식 요소 */
  children?: ReactNode;
  /** 색상 */
  color?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 클래스명 */
  className?: string;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 접근성 필수 입력 여부 */
  ariaRequired?: boolean;
  /** 이름 */
  name?: string;
}

export interface RadioGroupProps {
  /** 옵션 목록 */
  options?: RadioOption[];
  /** 현재 값 */
  value?: string | number;
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: string | number) => void;
  /** 레이아웃 방식 (flex 또는 grid) */
  layout?: "flex" | "grid";
  /** 방향 */
  direction?: RadioDirection;
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
  labelPosition?: RadioLabelPosition;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 접근성 필수 입력 여부 */
  ariaRequired?: boolean;
  /** 이름 */
  name?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Radio: React.FC<RadioProps> & {
  Group: React.FC<RadioGroupProps>;
};

export default Radio;
