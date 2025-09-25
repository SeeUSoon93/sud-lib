import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type {
  tagColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type TagSize = "sm" | "md" | "lg";

export type TagIconPosition = "left" | "right" | "";

export interface TagProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  colorType?: tagColorType;
  background?: string;
  color?: string;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: string | number;
  className?: string;
  closeable?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
  iconPosition?: TagIconPosition;
  shape?: shapeType;
  shadow?: shadowType;
  border?: boolean;
  size?: TagSize;
  style?: CSSProperties;
}

declare const Tag: FC<TagProps>;
export default Tag;
