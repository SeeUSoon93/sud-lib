import { ReactNode, CSSProperties } from "react";

export interface CarouselProps {
  /** 캐러셀에 표시할 아이템 배열 */
  items?: ReactNode[];
  /** 아이템의 너비 비율 (0~1) */
  itemWidthRatio?: number;
  /** 한 번에 표시할 아이템 수 */
  itemCount?: number;
  /** 자동 재생 여부 */
  autoPlay?: boolean;
  /** 자동 재생 간격 (ms) */
  autoPlayInterval?: number;
  /** 아이템 크기 변화 비율 */
  scaleRatio?: number;
  /** 아이템 투명도 변화 비율 */
  opacityRatio?: number;
  /** 캐러셀의 너비 */
  width?: string | number;
  /** 캐러셀의 높이 */
  height?: string | number;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: CSSProperties;
  /** 네비게이션 버튼 표시 여부 */
  navBtn?: boolean;
  /** 왼쪽 버튼 아이콘 */
  leftBtnIcon?: ReactNode;
  /** 오른쪽 버튼 아이콘 */
  rightBtnIcon?: ReactNode;
  /** 전환 효과 타입 */
  effectType?: "overlap" | "fade" | "slide" | "scale" | "stack";
  /** 드래그로 슬라이드 넘기기 활성화 여부 */
  drag?: boolean;
}

export const Carousel: React.FC<CarouselProps>;
