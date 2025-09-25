import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";
import type { PaginationProps } from "../navigation/Pagination";

export type TableSize = "sm" | "md" | "lg";

export type TableSortOrder = "ascend" | "descend" | null;

export interface TableColumn<T = any> {
  key: string;
  dataIndex?: string;
  title: ReactNode;
  width?: string | number;
  col?: number;
  sorter?: boolean | ((a: T, b: T) => number);
  render?: (value: any, record: T, index: number) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export type TableSorter<T> = {
  columnKey: keyof T;
  order: TableSortOrder;
} | null;

export interface TableProps<T = any> extends HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<T>[];
  dataSource: T[];
  rowKey?: string | ((record: T) => string);
  size?: TableSize;
  colorType?: defaultColorType;
  shape?: shapeType;
  shadow?: shadowType;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  width?: string | number;
  height?: string | number;
  style?: CSSProperties;
  pagination?: boolean | PaginationProps;
  onChange?: (pagination: {}, filters: {}, sorter: TableSorter<T>) => void;
  emptyText?: ReactNode;
}

export declare const Table: <T = any>(
  props: TableProps<T>
) => React.ReactElement;
