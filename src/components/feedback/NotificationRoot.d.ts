import { ReactNode } from "react";
import {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type NotificationPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface NotificationOptions {
  /** 알림 제목 */
  title?: ReactNode;
  /** 알림 메시지 */
  message?: ReactNode;
  /** 알림 푸터 */
  footer?: ReactNode;
  /** 알림 지속 시간 (밀리초, false로 설정 시 자동으로 닫히지 않음) */
  duration?: number | false;
  /** 알림 위치 */
  position?: NotificationPosition;
  /** 알림이 닫힐 때 실행될 콜백 */
  onClose?: () => void;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 텍스트 색상 */
  color?: string;
  /** 배경 색상 */
  background?: string;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 색상 */
  borderColor?: string;
  /** 테두리 두께 */
  borderWeight?: number;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 모서리 형태 */
  shape?: shapeType;
  /** 그림자 크기 */
  shadow?: shadowType;
  /** 알림 너비 */
  width?: number;
}

export interface NotificationItemProps extends NotificationOptions {
  /** 알림 ID */
  id: number;
  /** 알림 닫기 콜백 */
  onClose: () => void;
}

export interface NotificationRootProps {}

declare const NotificationRoot: React.FC<NotificationRootProps>;

export const notification: {
  open: (options: NotificationOptions) => void;
};

export default NotificationRoot;
