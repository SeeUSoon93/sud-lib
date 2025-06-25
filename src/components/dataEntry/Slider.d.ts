import { PopupBaseProps } from "../navigation/base/PopupBase";
import { defaultColorType, borderType, shadowType } from "../commonType";

export type SliderSize = "sm" | "md" | "lg";

export interface SliderProps {
  /** 최소값 */
  min?: number;
  /** 최대값 */
  max?: number;
  /** 현재 값 */
  value?: number;
  /** 단계 값 */
  step?: number;
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: number) => void;
  /** 수직 방향 여부 */
  vertical?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 배경색 */
  background?: string;
  /** 테두리 표시 여부 */
  border?: boolean;
  /** 테두리 스타일 */
  borderType?: borderType;
  /** 테두리 두께 */
  borderWeight?: number;
  /** 테두리 색상 */
  borderColor?: string;
  /** 트랙 색상 */
  trackColor?: string;
  /** 채우기 여부 */
  fill?: boolean;
  /** 슬라이더 너비 */
  width?: number | string;
  /** 슬라이더 높이 */
  height?: number | string;
  /** 최소/최대값 표시 여부 */
  minMaxVisible?: boolean;
  /** 색상 타입 */
  colorType?: defaultColorType;
  /** 마크 텍스트 */
  unit?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 클래스명 */
  className?: string;
  /** 그림자 효과 */
  shadow?: shadowType;
  /** 슬라이더 크기 */
  size?: SliderSize;
  /** 썸네일 크기 */
  thumbSize?: number;
  /** 썸네일 테두리 표시 여부 */
  thumbBorder?: boolean;
  /** 팝업의 클래스명 */
  popupClassName?: string;
  /** 팝업의 스타일 */
  popupStyle?: React.CSSProperties;
  /** 팝업 속성 */
  popupProps?: PopupBaseProps;
  /** 고유 ID */
  id?: string;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 접근성 값 텍스트 */
  ariaValueText?: string;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Slider: React.FC<SliderProps>;
export default Slider;
