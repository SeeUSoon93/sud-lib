import { ReactNode } from "react";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  /** 드로어 열림 여부 */
  open?: boolean;
  /** 드로어 닫기 콜백 */
  onClose?: () => void;
  /** 드로어 제목 */
  title?: ReactNode;
  /** 드로어 내용 */
  children?: ReactNode;
  /** 드로어 푸터 */
  footer?: ReactNode;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 구분선 표시 여부 */
  divider?: boolean;
  /** 구분선 색상 */
  dividerColor?: string;
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
  /** 드로어 모양 */
  shape?: shapeType;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 드로어 너비 */
  width?: number | string;
  /** 드로어 높이 */
  height?: number | string;
  /** 추가 클래스명 */
  className?: string;
  /** 드로어 위치 */
  placement?: DrawerPlacement;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 접근성 설명 ID */
  ariaDescribedby?: string;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

export declare const Drawer: React.FC<DrawerProps>;
