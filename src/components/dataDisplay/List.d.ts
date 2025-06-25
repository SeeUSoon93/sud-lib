import { ReactNode } from "react";

import { PaginationProps } from "../navigation/Pagination";
export interface ListProps {
  /** 데이터 소스 */
  dataSource?: ReactNode[];
  /** 페이지네이션 활성화 여부 */
  pagination?:
    | boolean
    | {
        /** 페이지네이션 컴포넌트 속성 */
        paginationProps?: PaginationProps;
      };
  /** 아이템 간격 */
  gap?: number;
  /** 구분선 표시 여부 */
  split?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 데이터가 없을 때 표시할 텍스트 */
  emptyText?: string;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 아이템 스타일 */
  itemStyle?: React.CSSProperties;
  /** 리스트 스타일 */
  listStyle?: React.CSSProperties;
  /** 가상 스크롤 활성화 여부 */
  virtualScroll?: boolean;
  /** 아이템 높이 (가상 스크롤) */
  itemHeight?: number;
  /** 오버스캔 개수 (가상 스크롤) */
  overscanCount?: number;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

export declare const List: React.FC<ListProps>;
