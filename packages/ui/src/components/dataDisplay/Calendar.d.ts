import { ReactNode } from "react";
import { Dayjs } from "dayjs";
import { defaultColorType, borderType } from "../commonType";

export type CalendarSize = "sm" | "md" | "lg" | "miniView";
export type CalendarView = "daily" | "month" | "year";

export interface CalendarItem {
  /** 아이템의 날짜 */
  date: Date;
  /** 아이템의 내용 */
  content: ReactNode;
  /** 아이템의 색상 타입 */
  colorType?: defaultColorType;
  /** 아이템의 배경색 */
  background?: string;
  /** 아이템의 텍스트 색상 */
  color?: string;
  /** 아이템의 테두리 표시 여부 */
  border?: boolean;
  /** 아이템의 테두리 색상 */
  borderColor?: string;
  /** 아이템의 테두리 스타일 */
  borderType?: borderType;
  /** 아이템의 테두리 두께 */
  borderWeight?: number;
}

export interface CalendarProps {
  /** 선택된 날짜 */
  value?: Date;
  /** 날짜 변경 시 호출되는 콜백 */
  onChange?: (date: Date | { startDate: Date; endDate: Date | null }) => void;
  /** 캘린더에 표시할 아이템 배열 */
  items?: CalendarItem[];
  /** 기본 뷰 모드 */
  view?: CalendarView;
  /** 뷰 컨트롤 표시 여부 */
  viewControl?: boolean;
  /** 날짜 컨트롤 표시 여부 */
  dateControl?: boolean;
  /** 헤더 커스텀 렌더링 */
  headerRender?: (props: {
    value: Dayjs;
    onChange: (date: Dayjs) => void;
    onPrev: () => void;
    onNext: () => void;
  }) => ReactNode;
  /** 뷰 컨트롤 커스텀 렌더링 */
  viewControlRender?: (props: {
    view: CalendarView;
    onChange: (view: CalendarView) => void;
  }) => ReactNode;
  /** 날짜 컨트롤 커스텀 렌더링 */
  dateControlRender?: (props: {
    value: Dayjs;
    onChange: (date: Dayjs) => void;
  }) => ReactNode;
  /** 로케일 */
  locale?: "en" | "ko";
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 호버 시 색상 타입 */
  hoverColorType?: defaultColorType;
  /** 배경색 */
  background?: string;
  /** 호버 시 배경색 */
  hoverBackground?: string;
  /** 텍스트 색상 */
  color?: string;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 테두리 색상 */
  borderColor?: string;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 두께 */
  borderWeight?: number;
  /** 캘린더 너비 */
  width?: number | string;
  /** 캘린더 높이 */
  height?: number | string;
  /** 추가 클래스명 */
  className?: string;
  /** 날짜 범위 선택 모드 */
  range?: boolean;
  /** 시작 날짜 (range 모드) */
  startDate?: Date;
  /** 종료 날짜 (range 모드) */
  endDate?: Date;
  /** 캘린더 크기 */
  size?: CalendarSize;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

export declare const Calendar: React.FC<CalendarProps>;
