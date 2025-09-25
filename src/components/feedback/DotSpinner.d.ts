import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type { tagColorType } from "../commonType";

export interface DotSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  colorType?: tagColorType;
  text?: boolean | string | ReactNode;
  style?: CSSProperties;
}

declare const DotSpinner: FC<DotSpinnerProps>;
export default DotSpinner;
