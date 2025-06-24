import { ReactNode } from "react";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type SegmentedSize = "sm" | "md" | "lg";

export interface SegmentedOption {
  /** 옵션 값 */
  value: string | number;
  /** 옵션 레이블 */
  label: ReactNode;
  /** 옵션 비활성화 여부 */
  disabled?: boolean;
}

export interface SegmentedProps {
  /** 옵션 배열 */
  options?: (SegmentedOption | string | number)[];
  /** 선택된 값 */
  value?: string | number;
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: string | number) => void;
  /** 전체 비활성화 여부 */
  disabled?: boolean;
  /** 세그먼트 크기 */
  size?: SegmentedSize;
  /** 블록 형태 여부 */
  block?: boolean;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 배경색 */
  background?: string;
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
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 세그먼트 모양 */
  shape?: shapeType;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 클래스명 */
  className?: string;
  /** 접근성 이름 */
  name?: string;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

export declare const Segmented: React.FC<SegmentedProps>;
