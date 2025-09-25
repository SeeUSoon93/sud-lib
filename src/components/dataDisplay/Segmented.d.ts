import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type SegmentedSize = "sm" | "md" | "lg";

export interface SegmentedOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps extends HTMLAttributes<HTMLDivElement> {
  options?: (SegmentedOption | string | number)[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  size?: SegmentedSize;
  block?: boolean;
  colorType?: defaultColorType;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  shadow?: shadowType;
  shape?: shapeType;
  style?: CSSProperties;
  className?: string;
  name?: string;
}

export declare const Segmented: FC<SegmentedProps>;
