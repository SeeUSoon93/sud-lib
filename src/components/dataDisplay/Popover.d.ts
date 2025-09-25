import type { FC } from "react";
import type { PopupBaseProps } from "../navigation/base/PopupBase";

type PopoverBaseProps = Omit<PopupBaseProps, "variant">;

export interface PopoverProps extends PopoverBaseProps {}

export declare const Popover: FC<PopoverProps>;
