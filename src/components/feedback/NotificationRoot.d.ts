import type { ReactNode } from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type NotificationPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface NotificationOptions {
  title?: ReactNode;
  message?: ReactNode;
  footer?: ReactNode;
  duration?: number | false;
  position?: NotificationPosition;
  onClose?: () => void;
  colorType?: defaultColorType;
  color?: string;
  background?: string;
  borderType?: borderType;
  borderColor?: string;
  borderWeight?: number;
  border?: boolean;
  shape?: shapeType;
  shadow?: shadowType;
  width?: number | string;
}

export interface NotificationItemProps extends NotificationOptions {
  id: number;
  onClose: () => void;
}

export interface NotificationRootProps {}

export declare const NotificationRoot: React.FC<NotificationRootProps>;

export declare const notification: {
  open: (options: NotificationOptions) => void;
};
