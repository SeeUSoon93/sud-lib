import type {
  ReactNode,
  CSSProperties,
  FC,
  HTMLAttributes,
  RefObject
} from "react";
import type {
  defaultColorType,
  borderType,
  shadowType,
  shapeType
} from "../../commonType";

export type PopupTrigger = "click" | "hover" | "contextMenu";

export type PopupPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "left-top"
  | "left-bottom"
  | "right-top"
  | "right-bottom";

export type PopupVariant =
  | "popup"
  | "popover"
  | "tooltip"
  | "dropdown"
  | "Menu"
  | "popconfirm";

export interface PopupBaseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  content: ReactNode | (() => ReactNode);
  title?: ReactNode;
  arrow?: boolean;
  trigger?: PopupTrigger;
  placement?: PopupPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnClick?: boolean;
  disabled?: boolean;
  divider?: boolean;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  shape?: shapeType;
  shadow?: shadowType;
  colorType?: defaultColorType;
  followTrigger?: boolean;
  contentRef?: RefObject<HTMLElement>;
  parentRef?: RefObject<HTMLElement>;
  variant?: PopupVariant;
  footer?: boolean | ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
}

declare const PopupBase: FC<PopupBaseProps>;

export default PopupBase;
