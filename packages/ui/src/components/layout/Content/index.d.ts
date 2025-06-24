import { ReactNode } from "react";

/**
 * Content 컴포넌트는 Layout(부모) 기준으로 position: absolute로 배치되며,
 * header/footer/sider offset에 따라 위치와 크기가 자동 조정됩니다.
 * width, height, top, left, right, bottom 등은 Layout 기준으로 계산됩니다.
 */
export interface LayoutOffset {
  /** 헤더 높이 */
  header?: number;
  /** 푸터 높이 */
  footer?: number;
  /** 사이드바 너비 */
  sider?: number;
}

export interface ContentProps {
  /** 컨텐츠 내용 */
  children?: ReactNode;
  /** 추가 클래스명 */
  className?: string;
  /** 배경색 */
  background?: string;
  /** 텍스트 색상 */
  color?: string;
  /** 레이아웃 오프셋 */
  layoutOffset?: LayoutOffset;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Content: React.ForwardRefExoticComponent<
  ContentProps & React.RefAttributes<HTMLDivElement>
>;

export default Content;
