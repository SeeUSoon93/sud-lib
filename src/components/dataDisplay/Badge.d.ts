import type { ReactNode, CSSProperties, FC } from "react";
import type {
  tagColorType, // badgeColorType -> tagColorType으로 변경
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
  count?: ReactNode; // number -> ReactNode 로 변경
  max?: number;
  dot?: boolean;
  showZero?: boolean;
  position?: BadgePosition;
  size?: BadgeSize;
  offsetRatio?: number;
  label?: boolean;
  colorType?: tagColorType; // badgeColorType -> tagColorType으로 변경
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  shape?: "circle" | "square" | "rounded"; // 'rounded' 추가
  shadow?: shadowType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  "aria-label"?: string;
}

export declare const Badge: FC<BadgeProps>;
