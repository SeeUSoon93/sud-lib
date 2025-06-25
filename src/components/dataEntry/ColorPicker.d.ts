import { ReactNode } from "react";
import { SelectProps } from "./Select";
import { InputProps } from "./Input";
import { SliderProps } from "./Slider";
import { CardProps } from "../dataDisplay/Card";
import { ButtonProps } from "../general/Button";
import { PopConfirmProps } from "../feedback/PopConfirm";

export type ColorPickerSize = "sm" | "md" | "lg";
export type ColorPickerMode = "HEX" | "HSB" | "RGB";
export type ColorPickerTrigger = "click" | "hover" | "contextMenu";
export type ColorPickerPlacement = "top" | "bottom" | "left" | "right";

export interface ColorPickerColor {
  /** HEX 색상 값 */
  hex: string;
  /** RGB 색상 값 */
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  /** HSB 색상 값 */
  hsb: {
    h: number;
    s: number;
    b: number;
  };
  /** 투명도 값 (0-100) */
  alpha: number;
}

export interface ColorPickerProps {
  /** 현재 선택된 색상 */
  color?: string;
  /** 색상 변경 시 호출되는 콜백 */
  onChange?: (color: ColorPickerColor) => void;
  /** ColorPicker 열림 상태 */
  open?: boolean;
  /** ColorPicker 열림 상태 변경 핸들러 */
  setOpen?: (open: boolean) => void;
  /** 커스텀 트리거 요소 */
  children?: ReactNode;
  /** 트리거 방식 */
  trigger?: ColorPickerTrigger;
  /** ColorPicker 위치 */
  placement?: ColorPickerPlacement;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 클래스명 */
  className?: string;
  /** ColorPicker 크기 */
  size?: ColorPickerSize;
  /** PopConfirm 컴포넌트 props */
  popConfirmProps?: Partial<PopConfirmProps>;
  /** Select 컴포넌트 props */
  selectProps?: Partial<SelectProps>;
  /** Input 컴포넌트 props */
  inputProps?: Partial<InputProps>;
  /** Slider 컴포넌트 props */
  sliderProps?: Partial<SliderProps>;
  /** Card 컴포넌트 props */
  cardProps?: Partial<CardProps>;
  /** Button 컴포넌트 props */
  buttonProps?: Partial<ButtonProps>;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const ColorPicker: React.FC<ColorPickerProps>;
export default ColorPicker;
