import type {
  ReactNode,
  CSSProperties,
  FC,
  HTMLAttributes,
  ReactElement
} from "react";
import type { fontSizeType, fontWeightType } from "../commonType";
import type {
  PretendardWeight,
  GmarketWeight,
  SuiteWeight
} from "../general/Typography";

export interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactElement;
  iconSize?: string | number;
  iconColor?: string;
  description?: ReactNode;
  pretendard?: PretendardWeight;
  gmarket?: GmarketWeight;
  suite?: SuiteWeight;
  fontFamily?: string;
  size?: fontSizeType;
  weight?: fontWeightType;
  as?: string;
  color?: string;
  style?: CSSProperties;
  className?: string;
}

export declare const Empty: FC<EmptyProps>;
