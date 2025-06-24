import { ReactNode } from "react";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";
import { PaginationProps } from "../navigation/Pagination";

export type TableSize = "sm" | "md" | "lg";

export type TableSortOrder = "ascend" | "descend" | null;

export interface TableColumn<T = any> {
  /** 컬럼의 고유 키 */
  key: string;
  /** 컬럼 제목 */
  title: ReactNode;
  /** 컬럼 너비 (px 또는 %) */
  width?: string | number;
  /** 컬럼 비율 (width가 지정되지 않은 경우 사용) */
  col?: number;
  /** 정렬 함수 */
  sorter?: boolean | ((a: T, b: T) => number);
  /** 컬럼 렌더링 함수 */
  render?: (text: any, record: T, index: number) => ReactNode;
  /** 컬럼 정렬 */
  align?: "left" | "center" | "right";
  /** 컬럼 클래스명 */
  className?: string;
}

export interface TableChangeEvent {
  /** 현재 페이지 */
  current?: number;
  /** 페이지당 항목 수 */
  pageSize?: number;
  /** 정렬 설정 */
  sorter?: {
    columnKey: string;
    order: TableSortOrder;
  };
}

export interface TableProps<T = any> {
  /** 테이블 컬럼 설정 */
  columns: TableColumn<T>[];
  /** 테이블 데이터 */
  dataSource: T[];
  /** 행의 고유 키 필드 또는 함수 */
  rowKey?: string | ((record: T) => string);
  /** 테이블 크기 */
  size?: TableSize;
  /** 테이블 색상 타입 */
  colorType?: defaultColorType;
  /** 테이블 모양 */
  shape?: shapeType;
  /** 테이블 그림자 */
  shadow?: shadowType;
  /** 테이블 테두리 표시 여부 */
  border?: boolean;
  /** 테이블 테두리 색상 */
  borderColor?: string;
  /** 테이블 테두리 스타일 */
  borderType?: borderType;
  /** 테이블 테두리 두께 */
  borderWeight?: number;
  /** 테이블 클래스명 */
  className?: string;
  /** 테이블 헤더 클래스명 */
  headerClassName?: string;
  /** 테이블 본문 클래스명 */
  bodyClassName?: string;
  /** 테이블 행 클래스명 */
  rowClassName?: string;
  /** 테이블 셀 클래스명 */
  cellClassName?: string;
  /** 테이블 너비 */
  width?: string | number;
  /** 테이블 높이 */
  height?: string | number;
  /** 테이블 스타일 */
  style?: React.CSSProperties;
  /** 페이지네이션 설정 */
  pagination?:
    | boolean
    | {
        /** 페이지네이션 컴포넌트 속성 */
        paginationProps?: PaginationProps;
      };
  /** 테이블 변경 이벤트 핸들러 */
  onChange?: (pagination: any, filters: any, sorter: any) => void;
  /** 데이터가 없을 때 표시할 텍스트 */
  emptyText?: ReactNode;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Table: React.FC<TableProps>;
export default Table;
