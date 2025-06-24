import { ReactNode } from "react";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type CollapseSize = "sm" | "md" | "lg";

export interface CollapseItem {
  /** 아이템의 고유 키 */
  key: string;
  /** 아이템의 레이블 */
  label: ReactNode;
  /** 아이템의 내용 */
  children: ReactNode;
}

export interface CollapseProps {
  /** 아코디언 아이템 배열 */
  items?: CollapseItem[];
  /** 열린 아이템의 키 배열 (제어 컴포넌트) */
  openKeys?: string[];
  /** 기본으로 열린 아이템의 키 배열 (비제어 컴포넌트) */
  defaultOpenKeys?: string[];
  /** 아이템 열림/닫힘 시 호출되는 콜백 */
  onChange?: (openKeys: string[]) => void;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 테두리 색상 */
  borderColor?: string;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 두께 */
  borderWeight?: number;
  /** 헤더 색상 타입 */
  headerColorType?: defaultColorType;
  /** 헤더 배경색 */
  headerBackground?: string;
  /** 헤더 텍스트 색상 */
  headerColor?: string;
  /** 내용 색상 타입 */
  contentColorType?: defaultColorType;
  /** 내용 배경색 */
  contentBackground?: string;
  /** 내용 텍스트 색상 */
  contentColor?: string;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 비활성화된 아이템의 키 배열 */
  disabledKeys?: string[];
  /** 추가 클래스명 */
  className?: string;
  /** 아코디언 크기 */
  size?: CollapseSize;
  /** 아코디언 모양 */
  shape?: shapeType;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

export declare const Collapse: React.FC<CollapseProps>;
