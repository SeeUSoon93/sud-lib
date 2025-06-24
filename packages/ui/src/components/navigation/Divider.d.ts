import { ReactNode } from "react";
import { defaultColorType, borderType } from "../commonType";
export type DividerAlign = "left" | "center" | "right";

export interface DividerProps {
  /** 구분선 내용 */
  content?: ReactNode;
  /** 내용 정렬 */
  align?: DividerAlign;
  /** 테두리 두께 */
  borderWeight?: number;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 텍스트 색상 */
  color?: string;
  /** 테두리 색상 */
  borderColor?: string;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 세로 방향 여부 */
  vertical?: boolean;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Divider: React.FC<DividerProps>;

export default Divider;
