import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type { defaultColorType, borderType } from "../commonType";

export type DividerAlign = "left" | "center" | "right" | "top" | "bottom";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  content?: ReactNode;
  align?: DividerAlign;
  borderWeight?: number;
  borderType?: borderType;
  border?: boolean;
  color?: string;
  borderColor?: string;
  colorType?: defaultColorType;
  width?: string | number;
  height?: string | number;
  vertical?: boolean;
  style?: CSSProperties;
  className?: string;
}

declare const Divider: FC<DividerProps>;
export default Divider;
