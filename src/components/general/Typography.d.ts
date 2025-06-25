import { ReactNode } from "react";

export type PretendardWeight =
  | "T"
  | "EL"
  | "L"
  | "R"
  | "M"
  | "SB"
  | "B"
  | "Black";
export type GmarketWeight = "Light" | "Medium" | "Bold";
export type SuitWeight = "L" | "R" | "M" | "SM" | "B" | "EB" | "H";
export type FontSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";
export type FontWeight = "normal" | "medium" | "semibold" | "bold";
export type ElementType =
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

export interface TypographyProps {
  /** 텍스트 내용 */
  children?: ReactNode;
  /** Pretendard 폰트 두께 */
  pretendard?: PretendardWeight;
  /** Gmarket 폰트 두께 */
  gmarket?: GmarketWeight;
  /** SUITE 폰트 두께 */
  suit?: SuitWeight;
  /** 코드 폰트 사용 여부 */
  code?: boolean;
  /** 커스텀 폰트 패밀리 */
  fontFamily?: string;
  /** 폰트 크기 */
  size?: FontSize;
  /** 폰트 두께 */
  weight?: FontWeight;
  /** 렌더링할 HTML 요소 */
  as?: ElementType;
  /** 텍스트 색상 */
  color?: string;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

export declare const Typography: React.FC<TypographyProps>;
