import { ReactNode } from "react";
import { tagColorType } from "../commonType";

export type ProgressType = "bar" | "circle" | "dashboard";
export type ProgressSize = "sm" | "md" | "lg";

export type ProgressValuePosition =
  | "inside-start"
  | "inside-center"
  | "inside-end"
  | "outside-left"
  | "outside-right";

export interface ProgressProps {
  /** 프로그레스 타입 */
  type?: ProgressType;
  /** 현재 값 */
  value?: number;
  /** 최대 값 */
  max?: number;
  /** 값 단위 */
  unit?: string;
  /** 텍스트 표시 여부 */
  showText?: boolean;
  /** 최대값 도달 시 표시할 아이콘 */
  iconWhenFull?: ReactNode;
  /** 최대값 미달 시 표시할 아이콘 */
  iconWhenNotFull?: ReactNode;
  /** 프로그레스 색상 타입 */
  colorType?: tagColorType;
  /** 배경색 타입 */
  backgroundColor?: string;
  /** 프로그레스 색상 */
  color?: string;
  /** 값 위치 */
  valuePosition?: ProgressValuePosition;
  /** 크기 */
  size?: ProgressSize;
  /** 글자 크기 */
  fontSize?: number;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Progress: React.FC<ProgressProps>;

export default Progress;
