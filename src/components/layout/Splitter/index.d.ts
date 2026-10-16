import type {
  CSSProperties,
  FC,
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes
} from "react";

/** px number, or a string such as "30%" or "240px". */
export type SplitterSize = number | string;

export interface SplitterCollapsibleConfig {
  /** Collapse or expand this panel from the bar before it. */
  start?: boolean;
  /** Collapse or expand this panel from the bar after it. */
  end?: boolean;
  /** "auto" shows the buttons on hover or focus. Default: "auto". */
  showCollapsibleIcon?: boolean | "auto";
}

export interface SplitterPanelProps {
  /** Controlled size. Update it from `onResize` / `onCollapse`. */
  size?: SplitterSize;
  /** Initial size for an uncontrolled panel. */
  defaultSize?: SplitterSize;
  min?: SplitterSize;
  max?: SplitterSize;
  resizable?: boolean;
  collapsible?: boolean | SplitterCollapsibleConfig;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface SplitterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onResize"> {
  layout?: "horizontal" | "vertical";
  /** Sizes are reported in px for every panel. */
  onResizeStart?: (sizes: number[]) => void;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
  onCollapse?: (collapsed: boolean[], sizes: number[]) => void;
  /** Visible bar thickness in px. Default: 1. */
  barSize?: number;
  /** Draggable hit area in px. Default: 16. */
  triggerSize?: number;
  barColor?: string;
  activeColor?: string;
  iconColor?: string;
  /** Icon color on hover. Defaults to `activeColor`. */
  iconActiveColor?: string;
  draggerIcon?: ReactNode;
  collapsibleIcon?: { start?: ReactNode; end?: ReactNode };
  /** Arrow-key step in px. Shift multiplies it by 5. Default: 10. */
  keyboardStep?: number;
  collapseLabels?: { collapse?: string; expand?: string };
  classNames?: {
    panel?: string;
    bar?: string;
    collapse?: string;
    dragger?: string | { default?: string; active?: string };
  };
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export declare const SplitterPanel: FC<SplitterPanelProps>;

declare const Splitter: ForwardRefExoticComponent<
  SplitterProps & RefAttributes<HTMLDivElement>
> & { Panel: FC<SplitterPanelProps> };

export { Splitter };
export default Splitter;
