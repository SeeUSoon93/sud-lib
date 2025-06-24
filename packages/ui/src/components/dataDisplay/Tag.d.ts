import { ReactNode } from "react";
import { tagColorType, shapeType, borderType, shadowType } from "../commonType";

export type TagSize = "sm" | "md" | "lg";

export type TagIconPosition = "left" | "right";

export interface TagProps {
  /** 태그 내용 */
  children: ReactNode;
  /** 태그 색상 타입 */
  colorType?: tagColorType;
  /** 태그 배경색 */
  background?: string;
  /** 태그 텍스트 색상 */
  color?: string;
  /** 태그 테두리 색상 */
  borderColor?: string;
  /** 태그 테두리 스타일 */
  borderType?: borderType;
  /** 태그 테두리 두께 */
  borderWeight?: string | number;
  /** 추가 클래스명 */
  className?: string;
  /** 닫기 버튼 표시 여부 */
  closeable?: boolean;
  /** 닫기 버튼 클릭 시 호출되는 콜백 */
  onClose?: () => void;
  /** 태그 아이콘 */
  icon?: ReactNode;
  /** 아이콘 위치 */
  iconPosition?: TagIconPosition;
  /** 태그 모양 */
  shape?: shapeType;
  /** 태그 그림자 */
  shadow?: shadowType;
  /** 태그 테두리 표시 여부 */
  border?: boolean;
  /** 태그 크기 */
  size?: TagSize;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Tag: React.FC<TagProps>;
export default Tag;
