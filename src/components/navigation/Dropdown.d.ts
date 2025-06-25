import { ReactNode } from "react";
import { MenuItem } from "./Menu";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";
export type DropdownTrigger = "click" | "hover" | "contextMenu";
export type DropdownPlacement = "top" | "bottom" | "left" | "right";

export interface DropdownProps {
  /** 드롭다운 트리거 요소 */
  children: ReactNode;
  /** 드롭다운 제목 */
  title?: string;
  /** 트리거 방식 */
  trigger?: DropdownTrigger;
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
  /** 추가 클래스명 */
  className?: string;
  /** 메뉴 항목 목록 */
  items?: MenuItem[];
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
  /** 메뉴 확장 타입 */
  expandType?: "accordion" | "popover";
  /** 팝업 위치 */
  popupPlacement?: DropdownPlacement;
  /** 메뉴 위치 (서브메뉴 등) */
  placement?: [DropdownPlacement, DropdownPlacement];
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Dropdown: React.FC<DropdownProps>;

export default Dropdown;
