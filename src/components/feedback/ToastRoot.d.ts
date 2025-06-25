import { ReactNode } from "react";

export type ToastType = "success" | "danger" | "info" | "warning";

export interface ToastOptions {
  /** 토스트 지속 시간 (밀리초) */
  duration?: number;
  /** 커스텀 아이콘 */
  icon?: ReactNode;
}

export interface ToastItemProps {
  /** 토스트 ID */
  id: number;
  /** 토스트 타입 */
  type: ToastType;
  /** 토스트 메시지 */
  message: ReactNode;
  /** 토스트 지속 시간 */
  duration: number;
  /** 토스트 닫기 콜백 */
  onClose: (id: number) => void;
  /** 커스텀 아이콘 */
  icon?: ReactNode;
}

export interface Toast {
  /** 토스트 타입 */
  type: ToastType;
  /** 토스트 메시지 */
  message: ReactNode;
  /** 토스트 옵션 */
  options?: ToastOptions;
}

/** ToastRoot 컴포넌트의 props 인터페이스 */
export interface ToastRootProps {
  /** 추가 props가 필요한 경우 여기에 정의 */
}

declare const ToastRoot: React.FC<ToastRootProps>;

export const toast: {
  success: (message: ReactNode, options?: ToastOptions) => void;
  danger: (message: ReactNode, options?: ToastOptions) => void;
  info: (message: ReactNode, options?: ToastOptions) => void;
  warning: (message: ReactNode, options?: ToastOptions) => void;
};

export default ToastRoot;
