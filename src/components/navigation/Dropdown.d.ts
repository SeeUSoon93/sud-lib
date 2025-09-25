import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type { MenuItem } from "./Menu";
import type { PopupPlacement, PopupTrigger } from "./base/PopupBase";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: ReactNode;
  trigger?: PopupTrigger;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnClick?: boolean;
  disabled?: boolean;
  className?: string;
  items?: MenuItem[];
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  shape?: shapeType;
  shadow?: shadowType;
  expandType?: "accordion" | "popover";
  popupPlacement?: PopupPlacement;
  placement?: [PopupPlacement, PopupPlacement];
  colorType?: defaultColorType;
  style?: CSSProperties;
}

declare const Dropdown: FC<DropdownProps>;
export default Dropdown;
