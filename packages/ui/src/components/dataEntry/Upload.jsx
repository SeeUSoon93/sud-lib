"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

import { DocumentOutline, TrashOutline, PhotoOutline } from "sud-icons";
import { mergeClassNames } from "../../theme/themeUtils";
import { Tag } from "../dataDisplay/Tag";
import { Image } from "../dataDisplay/Image";
import { toast } from "../feedback/ToastRoot";

const FilePreview = ({
  file,
  index,
  onRemove,
  listType = "text",
  listColorType,
  listErrorColorType = "red",
  listHoverColorType = "sky",
  listDeleteColorType = "coral",
  thumbnailSize,
  cardSize
}) => {
  const isError = file.status === "error";
  const [isTagHover, setIsTagHover] = useState(false);
  const [isTrashHover, setIsTrashHover] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  const renderPreview = () => {
    switch (listType) {
      case "thumbnail":
        return (
          <Tag
            className="sud-hover sud-upload__file sud-upload__file--thumbnail"
            colorType={
              isError
                ? listErrorColorType
                : isTrashHover
                ? listDeleteColorType
                : isTagHover
                ? listHoverColorType
                : listColorType
            }
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 8
            }}
          >
            <div
              className="sud-upload__file-content"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={() => setIsTagHover(true)}
              onMouseLeave={() => setIsTagHover(false)}
            >
              <div
                className="sud-upload__file-preview"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  className="sud-upload__file-thumbnail"
                  style={{ width: thumbnailSize, height: thumbnailSize }}
                >
                  {file.type.startsWith("image/") && previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt={file.name}
                      preview={false}
                      mask={null}
                      shape="rounded"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <PhotoOutline size={24} />
                  )}
                </div>
                <div
                  className="sud-upload__file-info"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <p>{file.name}</p>
                  <p>({formatFileSize(file.size)})</p>
                </div>
              </div>
            </div>
            <TrashOutline
              className="sud-upload__file-delete"
              size={16}
              onClick={() => onRemove(index)}
              onMouseEnter={() => setIsTrashHover(true)}
              onMouseLeave={() => setIsTrashHover(false)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`Remove ${file.name}`}
            />
          </Tag>
        );
      case "card":
        return (
          <Tag
            className="sud-hover sud-upload__file sud-upload__file--card"
            colorType={
              isError
                ? listErrorColorType
                : isTrashHover
                ? listDeleteColorType
                : isTagHover
                ? listHoverColorType
                : listColorType
            }
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              padding: 8
            }}
            onMouseEnter={() => setIsTagHover(true)}
            onMouseLeave={() => setIsTagHover(false)}
          >
            <div
              className="sud-upload__file-preview"
              style={{
                width: cardSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {file.type.startsWith("image/") && previewUrl ? (
                <Image
                  src={previewUrl}
                  alt={file.name}
                  preview={false}
                  mask={null}
                  shape="rounded"
                  ratio="1/1"
                  style={{
                    width: "100%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <PhotoOutline size={24} />
              )}
            </div>
            <div
              className="sud-upload__file-info"
              style={{
                width: cardSize,
                wordBreak: "break-all",
                whiteSpace: "normal",
                textAlign: "left",
                marginTop: 8,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <span>{file.name}</span>
              <span>({formatFileSize(file.size)})</span>
            </div>
            <TrashOutline
              className="sud-upload__file-delete"
              size={16}
              onClick={() => onRemove(index)}
              onMouseEnter={() => setIsTrashHover(true)}
              onMouseLeave={() => setIsTrashHover(false)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`Remove ${file.name}`}
            />
          </Tag>
        );

      default:
        return (
          <Tag
            className="sud-hover sud-upload__file sud-upload__file--text"
            colorType={
              isError
                ? listErrorColorType
                : isTrashHover
                ? listDeleteColorType
                : isTagHover
                ? listHoverColorType
                : listColorType
            }
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div
              className="sud-upload__file-content"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={() => setIsTagHover(true)}
              onMouseLeave={() => setIsTagHover(false)}
            >
              <div
                className="sud-upload__file-preview"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <DocumentOutline size={16} />
                {file.name}
                {file.size && ` (${formatFileSize(file.size)})`}
              </div>
            </div>
            <TrashOutline
              className="sud-upload__file-delete"
              size={16}
              onClick={() => onRemove(index)}
              onMouseEnter={() => setIsTrashHover(true)}
              onMouseLeave={() => setIsTrashHover(false)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`Remove ${file.name}`}
            />
          </Tag>
        );
    }
  };

  return renderPreview();
};

export const Upload = ({
  listType = "text",
  ext,
  multiple = false,
  maxCount,
  maxFileSize,
  disabled = false,
  fileList,
  showUploadList = true,
  onChange = () => {},
  onRemove,
  onDrag,
  children,
  className,
  ariaLabel,
  role = "button",
  listColorType = "default",
  listErrorColorType = "red",
  listHoverColorType = "sky",
  listDeleteColorType = "rose",
  listDirection = "column",
  thumbnailSize = 50,
  cardSize = 200,
  drag = false
}) => {
  const inputRef = useRef();
  const [internalFiles, setInternalFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isControlled = fileList !== undefined;
  const files = isControlled ? fileList : internalFiles;
  const objectUrls = useRef(new Set());

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current.clear();
    };
  }, []);

  const triggerUpload = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
      onDrag?.(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    onDrag?.(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    onDrag?.(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (selectedFiles) => {
    if (maxCount && files.length + selectedFiles.length > maxCount) {
      toast.danger(`최대 ${maxCount}개의 파일만 업로드할 수 있습니다.`);
      selectedFiles = selectedFiles.slice(0, maxCount - files.length);
    }

    if (maxFileSize) {
      const invalidFiles = selectedFiles.filter(
        (file) => file.size > maxFileSize
      );
      if (invalidFiles.length > 0) {
        const invalidFileNames = invalidFiles
          .map((file) => file.name)
          .join(", ");
        toast.danger(`${invalidFileNames} 파일의 크기가 제한을 초과했습니다.`);
        selectedFiles = selectedFiles.filter(
          (file) => file.size <= maxFileSize
        );
      }
    }

    if (ext) {
      const invalidFiles = selectedFiles.filter(
        (file) =>
          !ext.some((e) =>
            file.name.toLowerCase().endsWith(`.${e.toLowerCase()}`)
          )
      );

      if (invalidFiles.length > 0) {
        const invalidExts = [
          ...new Set(
            invalidFiles.map((file) => file.name.split(".").pop().toLowerCase())
          )
        ];
        toast.danger(`${invalidExts.join(", ")} 파일은 업로드할 수 없습니다.`);
        selectedFiles = selectedFiles.filter((file) =>
          ext.some((e) =>
            file.name.toLowerCase().endsWith(`.${e.toLowerCase()}`)
          )
        );
      }
    }

    const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;

    if (!isControlled) {
      setInternalFiles(newFiles);
    }
    onChange(multiple ? newFiles : newFiles[0]);
    setIsUploading(false);
  };

  const handleChange = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = useCallback(
    (index) => {
      const newFiles = files.filter((_, i) => i !== index);
      if (!isControlled) setInternalFiles(newFiles);
      onRemove?.(newFiles);
    },
    [files, isControlled, onRemove]
  );

  const renderFileList = () => {
    if (!showUploadList || files.length === 0 || listType === "none") {
      return null;
    }

    return (
      <div
        className="sud-upload__file-list"
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: listDirection,
          gap: 8,
          overflow: "auto"
        }}
        role="list"
        aria-label="Uploaded files"
      >
        {files.map((file, i) => (
          <FilePreview
            key={i}
            file={file}
            index={i}
            onRemove={handleRemove}
            listType={listType}
            listColorType={listColorType}
            listErrorColorType={listErrorColorType}
            listHoverColorType={listHoverColorType}
            listDeleteColorType={listDeleteColorType}
            thumbnailSize={thumbnailSize}
            cardSize={cardSize}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={mergeClassNames(
        "sud-upload",
        "sud-upload__container",
        className
      )}
      style={{ display: "inline-block" }}
    >
      <input
        className="sud-upload__input"
        ref={inputRef}
        type="file"
        accept={ext ? ext.map((e) => `.${e}`).join(",") : undefined}
        multiple={multiple}
        disabled={disabled || isUploading}
        onChange={handleChange}
        style={{ display: "none" }}
        aria-label="File input"
      />

      <div
        className="sud-upload__trigger"
        onClick={triggerUpload}
        role={role}
        aria-label={ariaLabel}
        style={{ cursor: disabled || isUploading ? "not-allowed" : "pointer" }}
        {...(drag && {
          onDragOver: handleDragEnter,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop
        })}
      >
        {children}
      </div>

      {renderFileList()}
    </div>
  );
};
