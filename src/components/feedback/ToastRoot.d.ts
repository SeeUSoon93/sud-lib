import type { ReactNode, FC } from "react";

export type ToastType = "success" | "danger" | "info" | "warning";

export interface ToastOptions {
  duration?: number;
  icon?: ReactNode;
}

export interface ToastItemProps {
  id: number;
  type: ToastType;
  message: ReactNode;
  duration: number;
  onClose: (id: number) => void;
  icon?: ReactNode;
}

export interface ToastRootProps {}

export declare const ToastRoot: FC<ToastRootProps>;

export declare const toast: {
  success: (message: ReactNode, options?: ToastOptions) => void;
  danger: (message: ReactNode, options?: ToastOptions) => void;
  info: (message: ReactNode, options?: ToastOptions) => void;
  warning: (message: ReactNode, options?: ToastOptions) => void;
};
