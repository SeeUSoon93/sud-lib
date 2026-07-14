"use client";

import { useEffect, useRef, useState } from "react";
import "../../index.css";
import { PhotoFill } from "sud-icons";
import { useTheme } from "../../theme/ThemeContext";
import {
  resolveColor,
  getShapeStyles,
  getShadowStyle
} from "../../theme/themeUtils";
import { Typography } from "../general/Typography";
import { createPortal } from "react-dom";
import { useDialogFocus } from "../../utils/useDialogFocus";

const styles = `
  .sud-image {
    position: relative;
  }
  .sud-image--interactive {
    cursor: pointer;
  }
  .sud-image__mask {
    opacity: 0;
    pointer-events: none;
  }
  .sud-image:hover .sud-image__mask {
    opacity: 1;
    pointer-events: auto;
  }
  .sud-image--interactive:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }
  .sud-image--interactive:focus-visible .sud-image__mask {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const Image = ({
  src,
  alt = "",
  width = 200,
  height,
  className = "",
  style = {},
  loading = "lazy",
  mask = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}
    >
      <PhotoFill size="30" />
      <Typography as="span" style={{ whiteSpace: "nowrap" }}>
        미리보기
      </Typography>
    </div>
  ),
  preview = true,
  onClick,
  ratio,
  shape = "square",
  shadow = "none",
  borderColor,
  borderType = "solid",
  borderWeight = "1",
  objectFit = "cover",
  ...rest
}) => {
  const theme = useTheme();
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);
  const interactive = preview || typeof onClick === "function";

  const dialogLayer = useDialogFocus({
    open: showPreview,
    containerRef: previewRef,
    onClose: () => setShowPreview(false)
  });

  // 스타일 시트 추가
  useEffect(() => {
    if (!document.getElementById("sud-image-styles")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "sud-image-styles";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
    }
  }, []);

  const handleClick = (e) => {
    onClick?.(e);

    if (preview && !e.defaultPrevented) {
      setShowPreview(true);
    }
  };

  const handleKeyDown = (event) => {
    rest.onKeyDown?.(event);
    if (event.defaultPrevented || !interactive) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  // 🧮 비율 계산
  let cssAspectRatio;
  if (ratio && ratio.includes("/")) {
    const [w, h] = ratio.split("/").map(Number);
    if (!isNaN(w) && !isNaN(h) && h !== 0) {
      cssAspectRatio = `${w} / ${h}`;
    }
  }

  // ✅ 스타일 클래스 처리

  const shadowStyle = getShadowStyle(shadow, theme);
  const shapeStyle = getShapeStyles(shape, theme);

  const combinedClassName = `sud-image${
    interactive ? " sud-image--interactive" : ""
  } ${className}`.trim();

  // ✅ 인라인 스타일 처리
  const containerStyle = {
    position: "relative",
    display: "inline-block",
    width: width ? (typeof width === "number" ? `${width}px` : width) : "auto",
    height: height
      ? typeof height === "number"
        ? `${height}px`
        : height
      : "auto",
    aspectRatio: cssAspectRatio,
    borderStyle: borderColor ? borderType : undefined,
    borderWidth: borderColor ? `${borderWeight}px` : undefined,
    borderColor: borderColor ? resolveColor(borderColor, theme) : undefined,
    boxShadow: shadowStyle,
    overflow: "hidden",
    ...shapeStyle,
    padding: "0",
    ...style
  };

  let imgStyle = {
    objectFit: objectFit,
    display: "block"
  };

  if (cssAspectRatio && width && !height) {
    imgStyle.width = "100%";
    imgStyle.height = "100%";
  } else if (width && !height) {
    imgStyle.width = "100%";
    imgStyle.height = "auto";
  } else if (!width && height) {
    imgStyle.width = "auto";
    imgStyle.height = "100%";
  } else if (width && height) {
    imgStyle.width = "100%";
    imgStyle.height = "100%";
  } else {
    imgStyle.width = "100%";
    imgStyle.height = "auto";
  }

  return (
    <>
      <div
        {...rest}
        className={combinedClassName}
        style={containerStyle}
        onClick={interactive ? handleClick : undefined}
        onKeyDown={handleKeyDown}
        role={interactive ? rest.role ?? "button" : rest.role}
        tabIndex={interactive ? rest.tabIndex ?? 0 : rest.tabIndex}
        aria-label={
          interactive
            ? rest["aria-label"] ?? (alt ? `Preview ${alt}` : "Preview image")
            : rest["aria-label"]
        }
        aria-haspopup={preview ? "dialog" : undefined}
        aria-expanded={preview ? showPreview : undefined}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          style={{
            ...imgStyle,
            ...shapeStyle,
            padding: "0"
          }}
        />

        {mask && (
          <div
            className={`sud-image__mask`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: resolveColor("black-9", theme) + "90",
              color: resolveColor("white-10", theme),
              transition: "opacity 0.3s",
              width: "100%",
              height: "100%"
            }}
            aria-hidden="true"
          >
            <div>{mask}</div>
          </div>
        )}
      </div>

      {showPreview &&
        createPortal(
          <div
            ref={previewRef}
            className="sud-image__preview"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: resolveColor("black-9", theme),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: dialogLayer
            }}
            onClick={() => setShowPreview(false)}
            role="dialog"
            aria-label="이미지 미리보기"
            aria-modal="true"
            tabIndex={-1}
          >
            <button
              type="button"
              data-autofocus
              aria-label="이미지 미리보기 닫기"
              onClick={() => setShowPreview(false)}
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                width: 40,
                height: 40,
                border: 0,
                borderRadius: "50%",
                color: resolveColor("white-10", theme),
                background: resolveColor("black-7", theme),
                cursor: "pointer",
                fontSize: 28,
                lineHeight: 1
              }}
            >
              ×
            </button>
            <img
              src={src}
              alt={alt}
              onClick={(event) => event.stopPropagation()}
              style={{
                maxWidth: "80%",
                maxHeight: "80%",
                boxShadow: `0 16px 48px ${resolveColor("black-8", theme)}`
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
};
