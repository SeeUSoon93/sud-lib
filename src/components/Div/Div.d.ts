import type {
  ReactNode,
  CSSProperties,
  MouseEvent,
  FC,
  HTMLAttributes
} from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export interface DivProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  colorType?: defaultColorType;
  background?: string;
  color?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
  className?: string;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 테두리 색상 */
  borderColor?: string;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 두께 */
  borderWeight?: number;
  /** 카드 모양 */
  shape?: shapeType;
  /** 그림자 효과 */
  shadow?: shadowType;
}

export declare const Div: FC<DivProps>;
