import type { CSSProperties, FC, HTMLAttributes } from "react";
import type { defaultColorType, shadowType } from "../commonType";

export interface PaginationStyle {
  colorType?: defaultColorType;
  shadow?: shadowType;
}

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  defaultCurrent?: number;
  total?: number;
  pageSize?: number;
  onChange?: (page: number) => void;
  showPrevNext?: boolean;
  showFirstLast?: boolean;
  maxVisibleButtons?: number;
  activeStyle?: PaginationStyle;
  defaultStyle?: PaginationStyle;
  style?: CSSProperties;
  align?: "left" | "right" | "center";
}

declare const Pagination: FC<PaginationProps>;
export default Pagination;
