import type { CSSProperties, FC, HTMLAttributes } from "react";
import type { PopupBaseProps } from "../navigation/base/PopupBase";
import type { defaultColorType, borderType, shadowType } from "../commonType";

export type SliderSize = "sm" | "md" | "lg";

export interface SliderProps extends HTMLAttributes<HTMLDivElement> {
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  onChange?: (value: number) => void;
  vertical?: boolean;
  disabled?: boolean;
  background?: string;
  border?: boolean;
  borderType?: borderType;
  borderWeight?: number;
  borderColor?: string;
  trackColor?: string;
  fill?: boolean;
  width?: number | string;
  height?: number | string;
  minMaxVisible?: boolean;
  colorType?: defaultColorType;
  unit?: string;
  style?: CSSProperties;
  className?: string;
  shadow?: shadowType;
  size?: SliderSize;
  thumbSize?: number;
  thumbBorder?: boolean;
  popupClassName?: string;
  popupStyle?: CSSProperties;
  popupProps?: Partial<PopupBaseProps>;
  id?: string;
  ariaLabel?: string;
  ariaValueText?: string;
}

declare const Slider: FC<SliderProps>;
export default Slider;
