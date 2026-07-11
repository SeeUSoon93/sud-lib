import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType,
  surfaceType
} from "../commonType";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export interface DrawerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  open?: boolean;
  onClose?: () => void;
  onEsc?: boolean;
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
  surface?: surfaceType;
  width?: number | string;
  height?: number | string;
  className?: string;
  placement?: DrawerPlacement;
  style?: CSSProperties;
  ariaLabel?: string;
  ariaDescribedby?: string;
}

export declare const Drawer: FC<DrawerProps>;
