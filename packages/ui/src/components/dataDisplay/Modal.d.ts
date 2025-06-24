import { ReactNode } from "react";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export interface ModalProps {
  /** 모달 열림 여부 */
  open?: boolean;
  /** 모달 닫기 콜백 */
  onClose?: () => void;
  /** ESC 키로 닫기 활성화 여부 */
  onEsc?: boolean;
  /** 모달 제목 */
  title?: ReactNode;
  /** 모달 내용 */
  children?: ReactNode;
  /** 모달 푸터 */
  footer?: ReactNode;
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
  /** 모달 모양 */
  shape?: shapeType;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 모달 너비 */
  width?: number | string;
  /** 모달 높이 */
  height?: number | string;
  /** 추가 클래스명 */
  className?: string;
  /** 구분선 표시 여부 */
  divider?: boolean;
  /** 구분선 색상 */
  dividerColor?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 접근성 설명 ID */
  ariaDescribedby?: string;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

export declare const Modal: React.FC<ModalProps>;
