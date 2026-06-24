import type { shadowType, surfaceType } from "../components/commonType";
import type { SUDTheme } from "./ThemeContext";

export interface ComputeColorStylesOptions {
  theme?: SUDTheme;
  border?: boolean;
  fallback?: string;
  componentType?: string;
}

export interface ColorStyleResult {
  bgColor?: string;
  txtColor?: string;
  borColor?: string | null;
  separator?: string;
  text?: string;
  now?: string;
}

export interface ParsedColorString {
  color?: string;
  intensity?: number;
}

export interface ResolveSurfaceStyleOptions {
  surface?: surfaceType;
  border?: boolean;
  shadow?: shadowType | boolean | null;
}

export interface ResolvedSurfaceStyle {
  border: boolean;
  shadow: shadowType;
}

export declare const computeColorStyles: (
  options?: ComputeColorStylesOptions
) => ColorStyleResult;
export declare const parseColorString: (colorString?: string) => ParsedColorString;
export declare const resolveColor: (
  colorString?: string,
  theme?: SUDTheme
) => string;
export declare const adjustBrightness: (hex: string, percent: number) => string;
export declare const getColorWithIntensity: (
  color: string,
  intensity?: number,
  theme?: SUDTheme
) => string;
export declare const mergeClassNames: (
  ...args: Array<string | false | null | undefined>
) => string;
export declare const normalizeShadow: (
  shadow?: shadowType | boolean | null | ""
) => shadowType;
export declare const surfacePresets: Record<
  surfaceType,
  { border: boolean; shadow: shadowType }
>;
export declare const resolveSurfaceStyle: (
  options?: ResolveSurfaceStyleOptions
) => ResolvedSurfaceStyle;
export declare const getShadowStyle: (
  shadow?: shadowType | boolean | null,
  theme?: SUDTheme
) => string;
export declare const getShapeStyles: (
  shape?: string,
  theme?: SUDTheme
) => Record<string, string | number>;
export declare const getFontStyles: (options: {
  size?: string;
  weight?: string;
  theme: SUDTheme;
}) => {
  fontSize: string;
  fontWeight: string | number;
};
export declare const applyPulseEffect: (element: HTMLElement) => void;
export declare const pulseThumbScaleWithBounce: (element: HTMLElement) => void;
