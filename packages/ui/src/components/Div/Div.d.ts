import { ReactNode, CSSProperties, MouseEvent } from "react";
import { defaultColorType } from "../commonType";

export interface DivProps {
  /** 자식 요소 */
  children?: ReactNode;

  /** 테마 색상 타입 (예: 'primary', 'secondary' 등) */
  colorType?: defaultColorType;

  /** 배경색 (테마 색상 문자열) */
  background?: string;

  /** 텍스트 색상 (테마 색상 문자열) */
  color?: string;

  /** 클릭 이벤트 핸들러 */
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;

  /** 인라인 스타일 */
  style?: CSSProperties;

  /** 추가 클래스명 */
  className?: string;
}

export const Div: React.FC<DivProps>;
