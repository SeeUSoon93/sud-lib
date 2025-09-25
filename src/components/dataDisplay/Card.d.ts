import type { ReactNode, CSSProperties, FC, HTMLAttributes } from "react";
import type {
  defaultColorType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type CardVariant =
  | "card"
  | "drawer"
  | "modal"
  | "notification"
  | "toast";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 카드 제목 */
  title?: ReactNode;
  /** 카드 내용 */
  children?: ReactNode;
  /** 카드 푸터 */
  footer?: ReactNode;
  /** 카드 썸네일 (이미지 URL 또는 ReactNode) */
  thumb?: ReactNode;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 배경색 */
  background?: string;
  /** 텍스트 색상 */
  color?: string;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 테두리 색상 */
  borderColor?: string;
  /** 구분선 색상 */
  dividerColor?: string;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 두께 */
  borderWeight?: number;
  /** 카드 모양 */
  shape?: shapeType;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 카드 너비 */
  width?: number | string;
  /** 카드 높이 */
  height?: number | string;
  /** 썸네일 높이 */
  thumbHeight?: number | string;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: CSSProperties;
  /** 카드 변형 (카드, 드로어, 모달 등) */
  variant?: CardVariant;
  /** 닫기 버튼 클릭 이벤트 핸들러 */
  onClose?: () => void;
  /** 구분선 표시 여부 */
  divider?: boolean;
  /** Drawer와 유사한 스타일을 적용할지 여부 */
  isDrawer?: boolean;
}

export declare const Card: FC<CardProps>;
