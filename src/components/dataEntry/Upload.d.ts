import type { ReactNode } from "react";
import type { tagColorType } from "../commonType";

export interface UploadFile extends File {
  status?: "uploading" | "done" | "error";
}

export interface UploadProps {
  listType?: "text" | "thumbnail" | "card" | "none";
  ext?: string[];
  multiple?: boolean;
  maxCount?: number;
  maxFileSize?: number;
  disabled?: boolean;
  fileList?: UploadFile[];
  showUploadList?: boolean;
  onChange?: (files: UploadFile | UploadFile[]) => void;
  onRemove?: (files: UploadFile[]) => void;
  onDrag?: (isDragging: boolean) => void;
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
  role?: string;
  listColorType?: tagColorType;
  listErrorColorType?: tagColorType;
  listHoverColorType?: tagColorType;
  listDeleteColorType?: tagColorType;
  listDirection?: "row" | "column";
  thumbnailSize?: number;
  cardSize?: number;
  drag?: boolean;
}

export declare const Upload: React.FC<UploadProps>;
