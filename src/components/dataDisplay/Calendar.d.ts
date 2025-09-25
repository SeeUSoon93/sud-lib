import type { ReactNode, CSSProperties, FC, HTMLAttributes, Key } from "react";
import type { borderType, tagColorType } from "../commonType";

export type CalendarSize = "sm" | "md" | "lg" | "miniView";
export type CalendarView = "daily" | "month" | "year";

export interface CalendarItem {
  key?: Key;
  date: string; // YYYY-MM-DD 형식
  content: ReactNode;
  colorType?: tagColorType;
  itemProps?: HTMLAttributes<HTMLSpanElement>;
}

export interface CalendarProps extends HTMLAttributes<HTMLDivElement> {
  value?: Date;
  onChange?: (date: Date | { startDate: Date; endDate: Date | null }) => void;
  items?: CalendarItem[];
  view?: CalendarView;
  viewControl?: boolean;
  dateControl?: boolean;
  headerRender?: ReactNode;
  viewControlRender?: ReactNode;
  dateControlRender?: ReactNode;
  locale?: "en" | "ko" | object;
  colorType?: tagColorType;
  background?: string;
  hoverBackground?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  width?: number | string;
  height?: number | string;
  range?: boolean;
  startDate?: Date;
  endDate?: Date;
  size?: CalendarSize;
  holidays?: string[];
  holidaysStyle?: CSSProperties;
}

export declare const Calendar: FC<CalendarProps>;
