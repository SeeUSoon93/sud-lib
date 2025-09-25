import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type { InputProps } from "./Input";
import type { SliderProps } from "./Slider";
import type { CardProps } from "../dataDisplay/Card";
import type { ButtonProps } from "../general/Button";
import type { PopConfirmProps } from "../feedback/PopConfirm";
import type {
  PopupPlacement,
  PopupTrigger
} from "../navigation/base/PopupBase";

export type ColorPickerSize = "sm" | "md" | "lg";

export interface ColorPickerColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsb: { h: number; s: number; b: number };
  alpha: number;
  rgba: string;
}

export interface ColorPickerProps extends HTMLAttributes<HTMLDivElement> {
  color?: string;
  onChange?: (color: ColorPickerColor) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  children?: ReactNode;
  trigger?: PopupTrigger;
  placement?: PopupPlacement;
  style?: CSSProperties;
  className?: string;
  size?: ColorPickerSize;
  popConfirmProps?: Partial<PopConfirmProps>;
  inputProps?: Partial<InputProps>;
  sliderProps?: Partial<SliderProps>;
  cardProps?: Partial<CardProps>;
  buttonProps?: Partial<ButtonProps>;
}

declare const ColorPicker: FC<ColorPickerProps>;
export default ColorPicker;
