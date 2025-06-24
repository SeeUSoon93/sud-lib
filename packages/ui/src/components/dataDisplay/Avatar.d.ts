import * as React from "react";
import type { ReactNode, KeyboardEvent } from "react";
import {
  tagColorType,
  defaultSizeType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export interface AvatarProps {
  /** 이미지 소스 URL */
  src?: string | ReactNode;
  /** 샘플 이미지 번호 (1-5) */
  sample?: number;
  /** 대체 텍스트 */
  alt?: string;
  /** 자식 요소 */
  children?: ReactNode;
  /** 아바타 크기 */
  size?: defaultSizeType | number;
  /** 아바타 모양 */
  shape?: shapeType;
  /** 색상 타입 */
  colorType?: tagColorType;
  /** 배경색 */
  background?: string;
  /** 텍스트 색상 */
  color?: string;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 테두리 색상 */
  borderColor?: string;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 두께 */
  borderWeight?: number;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 클래스명 */
  className?: string;
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  /** 키보드 이벤트 핸들러 */
  onKeyDown?: (e: KeyboardEvent) => void;
  /** 탭 인덱스 */
  tabIndex?: number;
}

export interface AvatarGroupProps {
  /** 아바타 배열 */
  avatars?: Array<AvatarProps>;
  /** 최대 표시 개수 */
  max?: number;
  /** 아바타 크기 */
  size?: defaultSizeType;
  /** 아바타 모양 */
  shape?: shapeType;
  /** 색상 타입 */
  colorType?: tagColorType;
  /** 배경색 */
  background?: string;
  /** 텍스트 색상 */
  color?: string;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 테두리 색상 */
  borderColor?: string;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 두께 */
  borderWeight?: number;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 클래스명 */
  className?: string;
  /** z-index 시작 값 */
  zIndexStart?: number;
  /** 접근성 레이블 */
  "aria-label"?: string;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

export interface AvatarComponent extends React.FC<AvatarProps> {
  Group: React.FC<AvatarGroupProps>;
}

declare const Avatar: AvatarComponent;

export default Avatar;
