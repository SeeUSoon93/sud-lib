import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
  onEsc?: boolean;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  colorType?: defaultColorType;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  shape?: shapeType;
  shadow?: shadowType;
  width?: number | string;
  height?: number | string;
  className?: string;
  divider?: boolean;
  dividerColor?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  ariaDescribedby?: string;
}

export declare const Modal: FC<ModalProps>;
