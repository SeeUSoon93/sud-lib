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

export interface FooterProps extends HTMLAttributes<HTMLDivElement> {
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
  onHeightChange?: (height: number) => void;
  siderPosition?: "above-header" | "below-header";
  siderWidth?: number;
  border?: boolean;
  style?: CSSProperties;
}

declare const Footer: ForwardRefExoticComponent<
  FooterProps & RefAttributes<HTMLDivElement>
>;

export default Footer;
