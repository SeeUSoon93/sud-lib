import { ReactNode } from "react";
import {
  defaultColorType,
  borderType,
  shadowType,
  shapeType
} from "../../commonType";

export type PopupTrigger = "click" | "hover" | "contextMenu";
export type PopupPlacement = "top" | "bottom" | "left" | "right";
export type PopupVariant =
  | "popup"
  | "popover"
  | "tooltip"
  | "dropdown"
  | "Menu"
  | "popconfirm";

export interface PopupBaseProps {
  /** 트리거 요소 */
  children: ReactNode;
  /** 팝업 내용 */
  content: ReactNode;
  /** 팝업 제목 */
  title?: string;
  /** 트리거 방식 */
  trigger?: PopupTrigger;
  /** 팝업 위치 */
  placement?: PopupPlacement;
  /** 제어된 열림 상태 */
  open?: boolean;
  /** 기본 열림 상태 */
  defaultOpen?: boolean;
  /** 열림 상태 변경 시 호출되는 콜백 */
  onOpenChange?: (open: boolean) => void;
  /** 클릭 시 닫기 여부 */
  closeOnClick?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 구분선 표시 여부 */
  divider?: boolean;
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
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 트리거 요소를 따라다니는 여부 */
  followTrigger?: boolean;
  /** 외부 컨텐츠 참조 */
  contentRef?: React.RefObject<HTMLElement>;
  /** 부모 팝업 참조 */
  parentRef?: React.RefObject<HTMLElement>;
  /** 팝업 변형 */
  variant?: PopupVariant;
  /** 푸터 표시 여부 */
  footer?: boolean | ReactNode;
  /** 취소 콜백 */
  onCancel?: () => void;
  /** 확인 콜백 */
  onConfirm?: () => void;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const PopupBase: React.FC<PopupBaseProps>;

export default PopupBase;
