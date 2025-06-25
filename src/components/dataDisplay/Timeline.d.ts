import { ReactNode } from "react";

export type TimelineMode = "left" | "right" | "alternate";
export type TimelineDotPosition = "left" | "center" | "right";

export interface TimelineItem {
  /** 아이템의 고유 키 */
  key?: string | number;
  /** 아이템 레이블 */
  label?: ReactNode;
  /** 아이템 내용 */
  content?: ReactNode | ReactNode[];
  /** 아이템 도트 아이콘 */
  dot?: ReactNode;
  /** 아이템 색상 */
  color?: string;
  /** 아이템 클래스명 */
  className?: string;
}

export interface TimelineProps {
  /** 타임라인 아이템 배열 */
  items?: TimelineItem[];
  /** 타임라인 모드 */
  mode?: TimelineMode;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Timeline: React.FC<TimelineProps>;
export default Timeline;
