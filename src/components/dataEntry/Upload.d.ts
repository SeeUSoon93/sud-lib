import { ReactNode } from "react";
import { tagColorType } from "../commonType";

export interface UploadProps {
  /** 파일 목록 표시 타입 */
  listType?: "text" | "thumbnail" | "card" | "none";
  /** 허용할 파일 확장자 */
  ext?: string[];
  /** 다중 파일 업로드 여부 */
  multiple?: boolean;
  /** 최대 파일 개수 */
  maxCount?: number;
  /** 최대 파일 크기 (bytes) */
  maxFileSize?: number;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 파일 목록 */
  fileList?: File[];
  /** 파일 목록 표시 여부 */
  showUploadList?: boolean;
  /** 파일 변경 시 호출되는 함수 */
  onChange?: (files: File | File[]) => void;
  /** 파일 제거 시 호출되는 함수 */
  onRemove?: (files: File[]) => void;
  /** 드래그 상태 변경 시 호출되는 함수 */
  onDrag?: (isDragging: boolean) => void;
  /** 자식 요소 */
  children?: ReactNode;
  /** 추가 클래스명 */
  className?: string;
  /** ARIA 라벨 */
  ariaLabel?: string;
  /** ARIA 역할 */
  role?: string;
  /** 파일 목록 색상 타입 */
  listColorType?: tagColorType;
  /** 파일 목록 에러 색상 타입 */
  listErrorColorType?: tagColorType;
  /** 파일 목록 호버 색상 타입 */
  listHoverColorType?: tagColorType;
  /** 파일 목록 삭제 색상 타입 */
  listDeleteColorType?: tagColorType;
  /** 파일 목록 방향 */
  listDirection?: "row" | "column";
  /** 썸네일 크기 */
  thumbnailSize?: number;
  /** 카드 크기 */
  cardSize?: number;
  /** 드래그 앤 드롭 활성화 여부 */
  drag?: boolean;
}

export const Upload: React.FC<UploadProps>;
