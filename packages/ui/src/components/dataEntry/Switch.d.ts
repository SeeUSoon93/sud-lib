import { ReactNode } from "react";
import { defaultColorType, shadowType } from "../commonType";

export interface SwitchProps {
  /** 스위치의 현재 상태 (제어 컴포넌트) */
  checked?: boolean;
  /** 스위치의 초기 상태 (비제어 컴포넌트) */
  defaultChecked?: boolean;
  /** 상태가 변경될 때 호출되는 함수 */
  onChange?: (checked: boolean) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 켜진 상태의 배경색 */
  onColor?: string;
  /** 꺼진 상태의 배경색 */
  offColor?: string;
  /** 켜진 상태의 텍스트 */
  onText?: ReactNode;
  /** 꺼진 상태의 텍스트 */
  offText?: ReactNode;
  /** 켜진 상태의 아이콘 */
  onIcon?: ReactNode;
  /** 꺼진 상태의 아이콘 */
  offIcon?: ReactNode;
  /** 썸네일 색상 */
  thumbColor?: string;
  /** 그림자 크기 */
  shadow?: shadowType;
  /** 스위치의 크기 */
  size?: "sm" | "md" | "lg";
  /** 스위치의 색상 타입 */
  colorType?: defaultColorType;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 고유 ID */
  id?: string;
  /** 접근성 레이블 */
  ariaLabel?: string;
}

declare const Switch: React.FC<SwitchProps>;
export default Switch;
