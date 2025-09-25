import type {
  ReactNode,
  CSSProperties,
  FC,
  HTMLAttributes,
  RefObject
} from "react";
import type { PopupPlacement } from "./base/PopupBase";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type MenuExpandType = "accordion" | "popover";

export interface MenuItem {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  children?: MenuItem[];
  icon?: ReactNode;
  mode?: "group";
  title?: ReactNode;
}

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  items?: MenuItem[];
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelect?: (key: string) => void;
  selectedColor?: string;
  selectedTextColor?: string;
  hoverColor?: string;
  hoverTextColor?: string;
  className?: string;
  divider?: boolean;
  dividerColor?: string;
  colorType?: defaultColorType;
  level?: number;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  shape?: shapeType;
  shadow?: shadowType;
  placement?: [PopupPlacement, PopupPlacement];
  horizontal?: boolean;
  expandType?: MenuExpandType;
  style?: CSSProperties;
  parentContentRef?: RefObject<HTMLElement>;
}

declare const Menu: FC<MenuProps>;
export default Menu;
