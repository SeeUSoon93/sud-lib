"use client";

import { useEffect, useState } from "react";
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

const styles = `
  .sud-image {
    cursor: pointer;
    position: relative;
  }
  .sud-image__mask {
    opacity: 0;
    pointer-events: none;
  }
  .sud-image:hover .sud-image__mask {
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
  shadow = "",
  borderColor,
  borderType = "solid",
  borderWeight = "1",
  objectFit = "cover",
  ...rest
}) => {
  const theme = useTheme();
  const [showPreview, setShowPreview] = useState(false);

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
    if (preview) {
      setShowPreview(true);
    } else if (onClick) {
      onClick(e);
    }
  };

  // 🧮 비율 계산
  let aspectRatio = 1;
  if (ratio && ratio.includes("/")) {
    const [w, h] = ratio.split("/").map(Number);
    if (!isNaN(w) && !isNaN(h) && h !== 0) {
      aspectRatio = h / w;
    }
  }

  // ✅ 스타일 클래스 처리

  const shadowStyle = getShadowStyle(shadow, theme);
  const shapeStyle = getShapeStyles(shape, theme);

  const combinedClassName = `sud-image ${className}`;

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

  if (width && !height) {
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
        className={combinedClassName}
        style={containerStyle}
        onClick={handleClick}
        role="img"
        aria-label={alt}
        {...rest}
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
              zIndex: 1000
            }}
            onClick={() => setShowPreview(false)}
            role="dialog"
            aria-label="이미지 미리보기"
            aria-modal="true"
          >
            <img
              src={src}
              alt={alt}
              style={{
                maxWidth: "80%",
                maxHeight: "80%",
                boxShadow: resolveColor("black-8", theme)
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
};
