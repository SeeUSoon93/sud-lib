import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  items?: ReactNode[];
  itemWidthRatio?: number;
  itemCount?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  scaleRatio?: number;
  opacityRatio?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
  navBtn?: boolean;
  leftBtnIcon?: ReactNode;
  rightBtnIcon?: ReactNode;
  effectType?: "overlap" | "fade" | "slide" | "scale" | "stack";
  drag?: boolean;
  onChange?: (index: number) => void;
  currentIndex?: number;
}

export declare const Carousel: FC<CarouselProps>;
