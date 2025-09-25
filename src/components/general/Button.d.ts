import type {
  ReactNode,
  MouseEvent,
  CSSProperties,
  FC,
  HTMLAttributes
} from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type LoadingType = "default" | "elastic" | "brush";
export type IconPosition = "left" | "right" | "";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> {
  children?: ReactNode;
  colorType?: defaultColorType;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  loadingType?: LoadingType;
  loadingPosition?: "left" | "right";
  shape?: shapeType;
  shadow?: shadowType;
  size?: ButtonSize;
  style?: CSSProperties;
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;
}

export declare const Button: FC<ButtonProps>;
