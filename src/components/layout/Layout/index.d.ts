import { ReactNode } from "react";

export type LayoutSiderPosition = "above-header" | "below-header";

/**
 * Layout 컴포넌트는 부모 컨테이너의 전체 영역을 기준으로 Header, Sider, Content, Footer를 배치합니다.
 * position: relative가 부모에 적용되고, 내부 컴포넌트는 position: absolute로 부모 기준으로 배치됩니다.
 * width, height는 기본적으로 100%이며, 부모 컨테이너의 크기에 따라 자동으로 맞춰집니다.
 */
export interface LayoutProps {
  /** 레이아웃 자식 요소 */
  children?: ReactNode;
  /** 사이드바 위치 */
  siderPosition?: LayoutSiderPosition;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Layout: React.FC<LayoutProps>;

export default Layout;
