import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type { tagColorType } from "../commonType";

export type SpinnerType = "default" | "elastic";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  colorType?: tagColorType;
  spinnerType?: SpinnerType;
  text?: boolean | string | ReactNode;
  style?: CSSProperties;
}

declare const Spinner: FC<SpinnerProps>;
export default Spinner;
