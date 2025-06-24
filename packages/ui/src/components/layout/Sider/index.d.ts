import { ReactNode } from "react";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../../commonType";
/**
 * Sider 컴포넌트는 Layout(부모) 기준으로 position: absolute로 좌측에 고정 배치됩니다.
 * width, height, top, left 등은 Layout 기준으로 계산되며, Sider의 위치와 Header/Footer의 높이에 따라 자동 조정됩니다.
 */
export interface SiderProps {
  /** 사이더 내용 */
  children?: ReactNode;
  /** 배경색 */
  background?: string;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 텍스트 색상 */
  color?: string;
  /** 테두리 색상 */
  borderColor?: string;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 두께 */
  borderWeight?: string | number;
  /** 추가 클래스명 */
  className?: string;
  /** 모양 */
  shape?: shapeType;
  /** 너비 */
  width?: string | number;
  /** 전체 높이 사용 여부 */
  FullHeight?: boolean;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 사이더 위치 */
  siderPosition?: "above-header" | "below-header";
  /** 헤더 높이 */
  headerHeight?: number;
  /** 푸터 높이 */
  footerHeight?: number;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}
