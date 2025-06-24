import { ReactNode } from "react";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export interface AccordionItem {
  key?: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: AccordionItem[];
  mode?: "group";
  title?: ReactNode;
  onClick?: () => void;
}

export interface AccordionProps {
  items?: AccordionItem[];
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelect?: (key: string) => void;
  selectedColor?: string;
  selectedTextColor?: string;
  hoverColor?: string;
  hoverTextColor?: string;
  className?: string;
  divider?: boolean;
  colorType?: defaultColorType;
  dividerColor?: string;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderType?: borderType;
  borderWeight?: number;
  shape?: shapeType;
  shadow?: shadowType;
  style?: React.CSSProperties;
}

export declare const Accordion: React.FC<AccordionProps>;
