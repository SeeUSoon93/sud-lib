import { ReactNode, MouseEvent } from "react";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type LoadingType = "default" | "elastic" | "brush";
export type IconPosition = "left" | "right";

export interface ButtonProps {
  /** 버튼의 내용 */
  children?: ReactNode;
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
  /** 클릭 이벤트 핸들러 */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  /** 추가 클래스명 */
  className?: string;
  /** 아이콘 */
  icon?: ReactNode;
  /** 아이콘 위치 */
  iconPosition?: IconPosition;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 로딩 중 표시될 텍스트 */
  loadingText?: string;
  /** 로딩 애니메이션 타입 */
  loadingType?: LoadingType;
  /** 버튼 모양 */
  shape?: shapeType;
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
}

export declare const Button: React.FC<ButtonProps>;
