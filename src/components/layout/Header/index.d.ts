import type {
  ReactNode,
  CSSProperties,
  ForwardRefExoticComponent,
  RefAttributes
} from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../../commonType";

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  background?: string;
  color?: string;
  colorType?: defaultColorType;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: string | number;
  className?: string;
  shape?: shapeType;
  height?: string | number;
  FullWidth?: boolean;
  shadow?: shadowType;
  siderPosition?: "above-header" | "below-header";
  siderWidth?: number;
  border?: boolean;
  style?: CSSProperties;
}

declare const Header: ForwardRefExoticComponent<
  HeaderProps & RefAttributes<HTMLDivElement>
>;

export default Header;
