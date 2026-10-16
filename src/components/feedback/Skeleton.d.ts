import type { CSSProperties, FC, HTMLAttributes, ReactNode } from "react";

export interface SkeletonAvatarConfig {
  size?: number | string;
  shape?: "circle" | "square";
}

export interface SkeletonTitleConfig {
  width?: number | string;
}

export interface SkeletonParagraphConfig {
  rows?: number;
  /** One width for the last row, or a width per row. */
  width?: number | string | (number | string)[];
}

export interface SkeletonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** When false, renders `children` instead. Default: true. */
  loading?: boolean;
  /** Shimmer animation. */
  active?: boolean;
  avatar?: boolean | SkeletonAvatarConfig;
  title?: boolean | SkeletonTitleConfig;
  paragraph?: boolean | SkeletonParagraphConfig;
  round?: boolean;
  baseColor?: string;
  highlightColor?: string;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export declare const Skeleton: FC<SkeletonProps>;
export default Skeleton;
