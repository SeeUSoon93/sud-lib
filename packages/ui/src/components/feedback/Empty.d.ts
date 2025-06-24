import { CSSProperties, ReactElement } from "react";

export interface EmptyProps {
  /**
   * 커스텀 아이콘 (size prop을 받을 수 있는 ReactElement)
   */
  icon?: ReactElement;
  /**
   * 아이콘 크기
   */
  iconSize?: string;
  /**
   * 아이콘 색상
   */
  iconColor?: string;
  /**
   * 빈 상태에 표시할 텍스트
   */
  description?: string;
  /**
   * Pretendard 폰트 스타일
   */
  pretendard?: "T" | "EL" | "L" | "R" | "M" | "SB" | "B" | "Black";
  /**
   * Gmarket 폰트 스타일
   */
  gmarket?: "Light" | "Medium" | "Bold";
  /**
   * Suite 폰트 스타일
   */
  suite?: "L" | "R" | "M" | "SM" | "B" | "EB" | "H";
  /**
   * 커스텀 폰트 패밀리
   */
  fontFamily?: string;
  /**
   * 텍스트 크기
   */
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  /**
   * 텍스트 굵기
   */
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  /**
   * HTML 태그
   */
  as?: string;
  /**
   * 텍스트 색상
   */
  color?: string;
  /**
   * 컨테이너에 적용할 추가 스타일
   */
  style?: CSSProperties;
  /**
   * 컨테이너에 적용할 추가 클래스명
   */
  className?: string;
  /**
   * 추가 props
   */
  [key: string]: any;
}

export const Empty: React.FC<EmptyProps>;
