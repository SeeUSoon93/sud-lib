import type { FC } from "react";
import type { PopupBaseProps } from "../navigation/base/PopupBase";

type TooltipBaseProps = Omit<
  PopupBaseProps,
  "variant" | "title" | "footer" | "onCancel" | "onConfirm" | "divider"
>;

export interface TooltipProps extends TooltipBaseProps {}

export declare const Tooltip: FC<TooltipProps>;
