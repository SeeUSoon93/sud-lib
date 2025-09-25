import type {
  ReactNode,
  CSSProperties,
  ForwardRefExoticComponent,
  RefAttributes,
  HTMLAttributes
} from "react";

export interface LayoutOffset {
  header?: number;
  footer?: number;
  sider?: number;
}

export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  background?: string;
  color?: string;
  layoutOffset?: LayoutOffset;
  style?: CSSProperties;
}

declare const Content: ForwardRefExoticComponent<
  ContentProps & RefAttributes<HTMLDivElement>
>;

export default Content;
