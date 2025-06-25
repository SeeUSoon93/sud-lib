import { ReactNode } from "react";
import {
  badgeColorType,
  defaultSizeType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type BadgePosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export type BadgeSize = defaultSizeType | number;

export interface BadgeProps {
  /** 뱃지에 표시될 숫자 */
  count?: number;
  /** 최대 표시 숫자 (이 이상은 max+ 로 표시) */
  max?: number;
  /** 점 형태로 표시할지 여부 */
  dot?: boolean;
  /** count가 0일 때도 표시할지 여부 */
  showZero?: boolean;
  /** 뱃지의 위치 */
  position?: BadgePosition;
  /** 뱃지의 크기 */
  size?: BadgeSize;
  /** 뱃지의 위치 오프셋 비율 (0~1 사이의 값) */
  offsetRatio?: number;
  /** 라벨 모드 활성화 (top-right/left일 때 size/2 위치로 고정) */
  label?: boolean;
  /** 뱃지의 색상 타입 */
  colorType?: badgeColorType;
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
  /** 뱃지의 모양 */
  shape?: "circle" | "square";
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 뱃지가 표시될 요소 */
  children?: ReactNode;
  /** 접근성 레이블 */
  "aria-label"?: string;
}

export declare const Badge: React.FC<BadgeProps>;
