import type {
  ReactNode,
  CSSProperties,
  FC,
  HTMLAttributes,
  MouseEvent
} from "react";
import type { shapeType, borderType, shadowType } from "../commonType";

export interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
  mask?: ReactNode;
  preview?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  ratio?: string;
  shape?: shapeType;
  shadow?: shadowType;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number | string;
}

export declare const Image: FC<ImageProps>;
