import type {
  ReactNode,
  CSSProperties,
  ForwardRefExoticComponent,
  RefAttributes,
  HTMLAttributes
} from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../../commonType";

export interface SiderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  background?: string;
  colorType?: defaultColorType;
  color?: string;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: string | number;
  className?: string;
  shape?: shapeType;
  width?: string | number;
  FullHeight?: boolean;
  shadow?: shadowType;
  onWidthChange?: (width: number) => void;
  siderPosition?: "above-header" | "below-header";
  headerHeight?: number;
  footerHeight?: number;
  border?: boolean;
  style?: CSSProperties;
}

declare const Sider: ForwardRefExoticComponent<
  SiderProps & RefAttributes<HTMLDivElement>
>;

export default Sider;
