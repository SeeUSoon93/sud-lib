import { tagColorType } from "../commonType";

export interface DotSpinnerProps {
  /** 스피너 크기 */
  size?: number;
  /** 스피너 색상 타입 */
  colorType?: tagColorType;
  /** 로딩 텍스트 */
  text?: boolean | string | React.ReactNode;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const DotSpinner: React.FC<DotSpinnerProps>;

export default DotSpinner;
