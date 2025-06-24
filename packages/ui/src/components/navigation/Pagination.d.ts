import { ReactNode } from "react";
import { defaultColorType, shadowType } from "../commonType";

export interface PaginationStyle {
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 그림자 효과 */
  shadow?: shadowType;
}

export interface PaginationProps {
  /** 현재 페이지 */
  defaultCurrent?: number;
  /** 전체 항목 수 */
  total?: number;
  /** 페이지당 항목 수 */
  pageSize?: number;
  /** 페이지 변경 시 호출되는 콜백 */
  onChange?: (page: number) => void;
  /** 이전/다음 버튼 표시 여부 */
  showPrevNext?: boolean;
  /** 첫/마지막 버튼 표시 여부 */
  showFirstLast?: boolean;
  /** 최대 표시 버튼 수 */
  maxVisibleButtons?: number;
  /** 활성화된 버튼 스타일 */
  activeStyle?: PaginationStyle;
  /** 기본 버튼 스타일 */
  defaultStyle?: PaginationStyle;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 정렬 방향 */
  align?: "left" | "right" | "center";
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Pagination: React.FC<PaginationProps>;

export default Pagination;
