import type { ReactNode, CSSProperties, HTMLAttributes } from "react";
import type { PaginationProps } from "../navigation/Pagination";

export interface ListProps<T = any> extends HTMLAttributes<HTMLDivElement> {
  dataSource?: T[];
  pagination?: boolean | PaginationProps;
  gap?: number;
  split?: boolean;
  loading?: boolean;
  emptyText?: ReactNode;
  className?: string;
  style?: CSSProperties;
  itemStyle?: CSSProperties;
  listStyle?: CSSProperties;
  virtualScroll?: boolean;
  itemHeight?: number;
  overscanCount?: number;
}

export declare const List: <T = any>(props: ListProps<T>) => React.ReactElement;
