import type {
  ReactNode,
  CSSProperties,
  MouseEvent,
  FC,
  HTMLAttributes
} from "react";
import type { defaultColorType } from "../commonType";

export interface DivProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  colorType?: defaultColorType;
  background?: string;
  color?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
  className?: string;
}

export declare const Div: FC<DivProps>;
