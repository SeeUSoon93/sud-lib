import { ReactNode, MouseEvent } from "react";
import { ButtonProps } from "./Button.d";
import {
  defaultColorType,
  defaultSizeType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";
export type FloatButtonPlacement =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center"
  | "left-center"
  | "right-center";

export interface FloatButtonAction extends Omit<ButtonProps, "children"> {
  /** 액션 버튼의 아이콘 */
  icon?: ReactNode;
  /** 액션 버튼의 클릭 이벤트 핸들러 */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export interface FloatButtonProps {
  /** 메인 버튼의 아이콘 */
  icon?: ReactNode;
  /** 메인 버튼의 클릭 이벤트 핸들러 */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  /** 액션 버튼들의 배열 */
  actions?: FloatButtonAction[];
  /** 버튼의 위치 */
  placement?: FloatButtonPlacement;
  /** 버튼의 모양 */
  shape?: shapeType;
  /** 버튼의 색상 타입 */
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
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 접근성 pressed 상태 */
  ariaPressed?: boolean;
  /** 접근성 expanded 상태 */
  ariaExpanded?: boolean;
  /** 접근성 controls */
  ariaControls?: string;
  /** ARIA role */
  role?: string;
  /** 서브 버튼들의 색상 타입 */
  subColorType?: defaultColorType;
  /** 버튼 크기 */
  size?: defaultSizeType;
}

export declare const FloatButton: React.FC<FloatButtonProps>;
