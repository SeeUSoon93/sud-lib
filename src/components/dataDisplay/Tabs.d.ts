import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type {
  defaultColorType,
  defaultSizeType,
  borderType
} from "../commonType";

export type TabsSize = defaultSizeType | "2xl";

export type TabsAlign = "left" | "center" | "right";

export interface TabsOption {
  key: string;
  label: ReactNode;
  children?: ReactNode;
}

export interface TabPaneProps {
  tabKey?: string;
  label: ReactNode;
  children?: ReactNode;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
  options?: TabsOption[];
  children?: ReactNode;
  size?: TabsSize;
  colorType?: {
    active?: defaultColorType;
    inactive?: defaultColorType;
  };
  background?: {
    active?: string;
    inactive?: string;
  };
  color?: {
    active?: string;
    inactive?: string;
  };
  border?: boolean;
  borderColor?: {
    active?: string;
    inactive?: string;
  };
  borderType?: borderType;
  borderWeight?: number;
  className?: string;
  style?: CSSProperties;
  disabledKeys?: string[];
  align?: TabsAlign;
}

declare const Tabs: FC<TabsProps> & {
  TabPane: FC<TabPaneProps>;
};

export default Tabs;
