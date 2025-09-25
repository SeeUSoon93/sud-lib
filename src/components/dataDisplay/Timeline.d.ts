import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";

export type TimelineMode = "left" | "right" | "alternate";

export interface TimelineItem {
  key?: string | number;
  label?: ReactNode;
  content?: ReactNode | ReactNode[];
  dot?: ReactNode;
  color?: string;
  className?: string;
}

export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  items?: TimelineItem[];
  mode?: TimelineMode;
  className?: string;
  style?: CSSProperties;
}

declare const Timeline: FC<TimelineProps>;
export default Timeline;
