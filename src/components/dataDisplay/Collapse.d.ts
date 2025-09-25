import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type CollapseSize = "sm" | "md" | "lg";

export interface CollapseItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
}

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  items?: CollapseItem[];
  openKeys?: string[];
  defaultOpenKeys?: string[];
  onChange?: (openKeys: string[]) => void;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  headerColorType?: defaultColorType;
  headerBackground?: string;
  headerColor?: string;
  contentColorType?: defaultColorType;
  contentBackground?: string;
  contentColor?: string;
  shadow?: shadowType;
  disabledKeys?: string[];
  className?: string;
  size?: CollapseSize;
  shape?: shapeType;
  style?: CSSProperties;
}

export declare const Collapse: FC<CollapseProps>;
