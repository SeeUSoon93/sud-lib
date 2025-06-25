import { ReactNode } from "react";
import { shapeType, borderType, shadowType } from "../commonType";

export interface ImageProps {
  /** 이미지 소스 URL */
  src: string;
  /** 대체 텍스트 */
  alt?: string;
  /** 이미지 너비 */
  width?: number | string;
  /** 이미지 높이 */
  height?: number | string;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 이미지 로딩 방식 */
  loading?: "lazy" | "eager";
  /** 마스크 오버레이 */
  mask?: ReactNode;
  /** 미리보기 기능 활성화 여부 */
  preview?: boolean;
  /** 클릭 이벤트 핸들러 */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** 이미지 비율 (예: "16/9") */
  ratio?: string;
  /** 이미지 모양 */
  shape?: shapeType;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 테두리 색상 */
  borderColor?: string;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 두께 */
  borderWeight?: number | string;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

export declare const Image: React.FC<ImageProps>;
