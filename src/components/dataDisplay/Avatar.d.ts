import type { ReactNode, KeyboardEvent, CSSProperties, FC } from "react";
import type {
  tagColorType,
  defaultSizeType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export interface AvatarProps {
  src?: string | ReactNode;
  sample?: 1 | 2 | 3 | 4 | 5;
  alt?: string;
  children?: ReactNode;
  size?: defaultSizeType | number;
  shape?: shapeType;
  colorType?: tagColorType;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  shadow?: shadowType;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  tabIndex?: number;
}

export interface AvatarGroupProps {
  avatars?: Array<Partial<AvatarProps>>;
  max?: number;
  size?: defaultSizeType;
  shape?: shapeType;
  colorType?: tagColorType;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  shadow?: shadowType;
  style?: CSSProperties;
  className?: string;
  zIndexStart?: number;
  gap?: number;
  "aria-label"?: string;
}

export interface AvatarComponent extends FC<AvatarProps> {
  Group: FC<AvatarGroupProps>;
}

declare const Avatar: AvatarComponent;

export default Avatar;
