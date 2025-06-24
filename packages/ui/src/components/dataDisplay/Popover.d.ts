import { ReactNode } from "react";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type PopoverTrigger = "click" | "hover" | "contextMenu";
export type PopoverPlacement = "top" | "bottom" | "left" | "right";

export interface PopoverProps {
  /** Popover 트리거 역할을 하는 요소 */
  children: ReactNode;
  /** Popover 제목 */
  title?: ReactNode;
  /** Popover 내용 */
  content?: ReactNode;
  /** 트리거 방식 */
  trigger?: PopoverTrigger;
  /** Popover 위치 */
  placement?: PopoverPlacement;
  /** Popover 열림 상태 (제어용) */
  open?: boolean;
  /** Popover 기본 열림 상태 */
  defaultOpen?: boolean;
  /** Popover 열림 상태 변경 콜백 */
  onOpenChange?: (open: boolean) => void;
  /** 클릭 시 닫기 여부 */
  closeOnClick?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 클래스명 */
  className?: string;
  /** 구분선 표시 여부 */
  divider?: boolean;
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
  /** Popover 모양 */
  shape?: shapeType;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

export declare const Popover: React.FC<PopoverProps>;
