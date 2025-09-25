import type { ReactNode, CSSProperties, FC } from "react";
import type { fontSizeType } from "../commonType";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbProps {
  className?: string;
  items?: BreadcrumbItem[];
  separator?: ReactNode;
  style?: CSSProperties;
  separatorStyle?: CSSProperties;
  linkStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  listStyle?: CSSProperties;
  size?: fontSizeType;
}

declare const Breadcrumb: FC<BreadcrumbProps>;
export default Breadcrumb;
