import type { FC } from "react";
import type { PopupBaseProps } from "../navigation/base/PopupBase";

type PopConfirmBaseProps = Omit<
  PopupBaseProps,
  "variant" | "arrow" | "followTrigger" | "contentRef" | "parentRef"
>;

export interface PopConfirmProps extends PopConfirmBaseProps {
  type?: "primary" | "success" | "danger" | "warning";
}

export declare const PopConfirm: FC<PopConfirmProps>;

export default PopConfirm;
