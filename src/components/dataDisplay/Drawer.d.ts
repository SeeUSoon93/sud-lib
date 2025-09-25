import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  colorType?: defaultColorType;
  divider?: boolean;
  dividerColor?: string;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  shape?: shapeType;
  shadow?: shadowType;
  width?: number | string;
  height?: number | string;
  className?: string;
  placement?: DrawerPlacement;
  style?: CSSProperties;
  ariaLabel?: string;
  ariaDescribedby?: string;
}

export declare const Drawer: FC<DrawerProps>;
