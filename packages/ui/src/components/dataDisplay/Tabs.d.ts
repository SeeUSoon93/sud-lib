import { ReactNode } from "react";
import {
  defaultColorType,
  defaultSizeType,
  shapeType,
  borderType,
  shadowType
} from "../commonType";

export type TabsSize = defaultSizeType | "2xl";

export type TabsAlign = "left" | "center" | "right";

export interface TabsOption {
  /** 탭의 고유 키 */
  key: string;
  /** 탭의 레이블 */
  label: ReactNode;
  /** 탭의 내용 */
  children?: ReactNode;
}

export interface TabPaneProps {
  /** 탭의 고유 키 */
  tabKey?: string;
  /** 탭의 레이블 */
  label: ReactNode;
  /** 탭의 내용 */
  children?: ReactNode;
}

export interface TabsProps {
  /** 현재 선택된 탭의 키 (제어 컴포넌트) */
  value?: string;
  /** 기본 선택 탭의 키 (비제어 컴포넌트) */
  defaultValue?: string;
  /** 탭 변경 시 호출되는 콜백 */
  onChange?: (key: string) => void;
  /** 탭 옵션 배열 */
  options?: TabsOption[];
  /** 탭 크기 */
  size?: TabsSize;
  /** 탭 색상 타입 */
  colorType?: {
    active?: defaultColorType;
    inactive?: defaultColorType;
  };
  /** 탭 배경색 */
  background?: {
    active?: string;
    inactive?: string;
  };
  /** 탭 텍스트 색상 */
  color?: {
    active?: string;
    inactive?: string;
  };
  /** 탭 테두리 표시 여부 */
  border?: boolean;
  /** 탭 테두리 색상 */
  borderColor?: {
    active?: string;
    inactive?: string;
  };
  /** 탭 테두리 스타일 */
  borderType?: borderType;
  /** 탭 테두리 두께 */
  borderWeight?: number;
  /** 탭 선택 시 하단 밑줄 색상 */
  underlineColor?: {
    active?: string;
    inactive?: string;
  };
  /** 추가 클래스명 */
  className?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 선택된 탭의 스타일 */
  activeStyle?: {
    background?: string;
    color?: string;
    borderColor?: string;
    [key: string]: any;
  };
  /** 선택되지 않은 탭의 스타일 */
  inactiveStyle?: {
    background?: string;
    color?: string;
    borderColor?: string;
    [key: string]: any;
  };
  /** 탭 내용 */
  children?: ReactNode;
  /** 비활성화할 탭의 키 배열 */
  disabledKeys?: string[];
  /** 탭의 정렬 위치 */
  align?: TabsAlign;
  /** 추가 HTML 속성 */
  [key: string]: any;
}

declare const Tabs: React.FC<TabsProps> & {
  TabPane: React.FC<TabPaneProps>;
};

export default Tabs;
