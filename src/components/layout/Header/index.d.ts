import { ReactNode } from "react";

import {
  defaultColorType,
  defaultSizeType,
  shapeType,
  borderType,
  shadowType
} from "../../commonType";

/**
 * Header 컴포넌트는 Layout(부모) 기준으로 position: absolute로 상단에 고정 배치됩니다.
 * width는 100% 또는 Sider에 따라 calc로 계산되며, height는 지정값을 사용합니다.
 * top/left는 Layout 기준으로 배치됩니다.
 */
export interface HeaderProps {
  /** 헤더 내용 */
  children?: ReactNode;
  /** 배경색 */
  background?: string;
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
  /** 높이 */
  height?: string | number;
  /** 전체 너비 사용 여부 */
  FullWidth?: boolean;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 사이드바 위치 */
  siderPosition?: "above-header" | "below-header";
  /** 사이드바 너비 */
  siderWidth?: number;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Header: React.ForwardRefExoticComponent<
  HeaderProps & React.RefAttributes<HTMLDivElement>
>;

export default Header;
