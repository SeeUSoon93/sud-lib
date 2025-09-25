import type { ReactNode, MouseEvent, CSSProperties, FC } from "react";
import type { ButtonProps } from "./Button";
import type {
  defaultColorType,
  defaultSizeType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type FloatButtonPlacement =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center"
  | "left-center"
  | "right-center";

export type FloatButtonDirection = "up" | "down" | "left" | "right";

export interface FloatButtonAction extends Omit<ButtonProps, "children"> {}

export interface FloatButtonProps {
  icon?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  actions?: FloatButtonAction[];
  placement?: FloatButtonPlacement;
  shape?: shapeType;
  colorType?: defaultColorType;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  disabled?: boolean;
  shadow?: shadowType;
  style?: CSSProperties;
  className?: string;
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;
  role?: string;
  subColorType?: defaultColorType;
  size?: defaultSizeType;
  isExample?: boolean;
  direction?: FloatButtonDirection;
}

export declare const FloatButton: FC<FloatButtonProps>;
