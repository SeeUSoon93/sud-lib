import { ReactNode } from "react";
import { PopupBaseProps } from "../navigation/base/PopupBase";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type PopConfirmType = "success" | "danger" | "warning";
export type PopConfirmTrigger = "click" | "hover" | "focus";
export type PopConfirmPlacement = "top" | "bottom" | "left" | "right";

export interface PopConfirmProps
  extends Omit<PopupBaseProps, "title" | "content" | "variant"> {
  /** 팝업 제목 */
  title?: ReactNode;
  /** 팝업 내용 */
  content?: ReactNode;
  /** 트리거 방식 */
  trigger?: PopConfirmTrigger;
  /** 팝업 위치 */
  placement?: PopConfirmPlacement;
  /** 팝업 표시 여부 */
  open?: boolean;
  /** 초기 팝업 표시 여부 */
  defaultOpen?: boolean;
  /** 팝업 표시 상태 변경 시 호출되는 함수 */
  onOpenChange?: (open: boolean) => void;
  /** 클릭 시 닫기 여부 */
  closeOnClick?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 클래스명 */
  className?: string;
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
  /** 모양 */
  shape?: shapeType;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 팝업 타입 */
  type?: PopConfirmType;
  /** 취소 시 호출되는 함수 */
  onCancel?: () => void;
  /** 확인 시 호출되는 함수 */
  onConfirm?: () => void;
  /** 푸터 영역 */
  footer?: ReactNode | boolean;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** ARIA 역할 */
  role?: "alertdialog";
  /** ARIA 레이블 ID */
  "aria-labelledby"?: string;
  /** ARIA 설명 ID */
  "aria-describedby"?: string;
  /** ARIA 모달 여부 */
  "aria-modal"?: "true" | "false";
}

declare const PopConfirm: React.FC<PopConfirmProps>;

export default PopConfirm;
