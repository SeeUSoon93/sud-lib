import { ReactNode } from "react";

export interface BreadcrumbItem {
  /** 항목 레이블 (문자열 또는 React 노드) */
  label: ReactNode;
  /** 항목 링크 */
  href?: string;
}

export interface BreadcrumbProps {
  /** 추가 클래스명 */
  className?: string;
  /** 브레드크럼 항목 목록 */
  items?: BreadcrumbItem[];
  /** 구분자 */
  separator?: ReactNode;
  /** 컨테이너 스타일 */
  style?: React.CSSProperties;
  /** 구분자 스타일 */
  separatorStyle?: React.CSSProperties;
  /** 링크 스타일 */
  linkStyle?: React.CSSProperties;
  /** 항목 스타일 */
  itemStyle?: React.CSSProperties;
  /** 목록 스타일 */
  listStyle?: React.CSSProperties;
  /** 텍스트 크기 (Typography size prop과 동일) */
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

declare const Breadcrumb: React.FC<BreadcrumbProps>;

export default Breadcrumb;
