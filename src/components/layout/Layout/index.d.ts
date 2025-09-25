import type { ReactNode, FC, HTMLAttributes } from "react";

export type LayoutSiderPosition = "above-header" | "below-header";

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  siderPosition?: LayoutSiderPosition;
}

declare const Layout: FC<LayoutProps>;
export default Layout;
