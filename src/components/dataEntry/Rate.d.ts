import { ReactElement } from "react";

export type RateIcon = "star" | "heart" | ReactElement;

export interface RateProps {
  /** 별점 개수 */
  count?: number;
  /** 반값 선택 허용 여부 */
  allowHalf?: boolean;
  /** 초기값 */
  defaultValue?: number;
  /** 현재 값 */
  value?: number;
  /** 값 변경 시 호출되는 함수 */
  onChange?: (value: number) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 값 표시 여부 */
  showValue?: boolean;
  /** 활성화된 아이콘 색상 */
  activeColor?: string;
  /** 비활성화된 아이콘 색상 */
  inactiveColor?: string;
  /** 아이콘 크기 */
  size?: number;
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** ARIA 라벨 */
  ariaLabel?: string;
  /** 테스트 ID */
  testId?: string;
  /** 아이콘 타입 */
  icon?: RateIcon;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Rate: React.FC<RateProps>;

export default Rate;
