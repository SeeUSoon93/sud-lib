import { ReactNode } from "react";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";
export type MenuExpandType = "accordion" | "popover";
export type MenuPlacement = "top" | "bottom" | "left" | "right";

export interface MenuItem {
  /** 메뉴 항목 키 */
  key: string;
  /** 메뉴 항목 레이블 */
  label: ReactNode;
  /** 클릭 시 호출되는 콜백 */
  onClick?: () => void;
  /** 하위 메뉴 항목 */
  children?: MenuItem[];
}

export interface MenuProps {
  /** 메뉴 항목 목록 */
  items?: MenuItem[];
  /** 선택된 항목 키 */
  selectedKey?: string;
  /** 기본 선택된 항목 키 */
  defaultSelectedKey?: string;
  /** 항목 선택 시 호출되는 콜백 */
  onSelect?: (key: string) => void;
  /** 선택된 항목 배경색 */
  selectedColor?: string;
  /** 선택된 항목 텍스트 색상 */
  selectedTextColor?: string;
  /** 호버 시 배경색 */
  hoverColor?: string;
  /** 호버 시 텍스트 색상 */
  hoverTextColor?: string;
  /** 추가 클래스명 */
  className?: string;
  /** 구분선 표시 여부 */
  divider?: boolean;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 메뉴 레벨 */
  level?: number;
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
  /** 팝업 위치 */
  placement?: [MenuPlacement, MenuPlacement];
  /** 가로 방향 여부 */
  horizontal?: boolean;
  /** 메뉴 확장 타입 */
  expandType?: MenuExpandType;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 부모 팝업 참조 */
  parentContentRef?: React.RefObject<HTMLElement>;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Menu: React.FC<MenuProps>;

export default Menu;
