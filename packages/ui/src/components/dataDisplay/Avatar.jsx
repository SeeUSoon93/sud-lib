"use client";

import { useMemo } from "react";
import {
  computeColorStyles,
  getShadowStyle,
  getShapeStyles,
  resolveColor
} from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";
import { PopupBase } from "../navigation/base/PopupBase";
import { Typography } from "../general/Typography";
import React from "react";

const SIZE_MAP = {
  xs: 56,
  sm: 72,
  md: 98,
  lg: 104,
  xl: 120
};

const AVATAR_SAMPLES = {
  1: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FSGmbI%2FbtsNspkfnci%2FVVldtkz1m7we0BbpfOvXX0%2Fimg.png",
  2: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Ft0zhR%2FbtsNsnzTUXZ%2FPfBZVB4KhKn4wTm7KHFI1k%2Fimg.png",
  3: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FSI7A2%2FbtsNsiTcfnV%2F2GeZTFsZRuNd3o5G9G4nQK%2Fimg.png",
  4: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FccFiG4%2FbtsNsQ2H17C%2FuU9CgCh6bGjDd6342Xhlck%2Fimg.png",
  5: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fdd9NJK%2FbtsNv6Li3e6%2FuKfKlCZhMfd7wg0eq7tTc1%2Fimg.png"
};

export const Avatar = ({
  src,
  sample = 1,
  alt = "avatar",
  children,
  size = "md",
  shape = "circle",
  colorType = "default",
  background,
  color,
  border = false,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  shadow = "none",
  style = {},
  className = "",
  onClick,
  onKeyDown,
  tabIndex = 0,
  ...rest
}) => {
  const theme = useTheme();
  const dimension =
    typeof size === "number" ? size : SIZE_MAP[size] || SIZE_MAP.md;

  const { bgColor, txtColor, borColor } = computeColorStyles({
    border,
    componentType: "tag",
    fallback: colorType
  });

  const finalBgColor = background ? resolveColor(background, theme) : bgColor;
  const finalTxtColor = color ? resolveColor(color, theme) : txtColor;
  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : borColor;
  const finalBorStyle =
    border && finalBorColor
      ? `${borderWeight}px ${borderType} ${finalBorColor}`
      : "none";

  const shapeStyle = getShapeStyles(shape, theme);
  const boxShadow = getShadowStyle(shadow, theme);

  const finalSrc = src
    ? src
    : children
    ? null
    : sample
    ? AVATAR_SAMPLES[sample]
    : null;

  const renderContent = () => {
    if (children) {
      return children;
    }

    if (finalSrc) {
      if (typeof finalSrc === "string") {
        if (finalSrc.startsWith("http") || finalSrc.startsWith("/")) {
          return (
            <img
              className="sud-avatar-img"
              src={finalSrc}
              alt={alt}
              role="presentation"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />
          );
        }

        // 텍스트인 경우 첫 글자만 표시
        return (
          <Typography
            pretendard="Black"
            style={{ fontSize: `${dimension * 0.4}px` }}
            color={finalTxtColor}
          >
            {finalSrc.charAt(0)}
          </Typography>
        );
      }

      // JSX 요소인 경우
      return React.cloneElement(finalSrc, {
        size: dimension * 0.5,
        color: finalTxtColor
      });
    }

    return null;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
    onKeyDown?.(e);
  };

  return (
    <div
      className={`sud-avatar ${className}`}
      role="img"
      aria-label={alt || "아바타 이미지"}
      tabIndex={onClick ? tabIndex : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{
        width: dimension,
        height: dimension,
        background: finalBgColor,
        color: finalTxtColor,
        border: finalBorStyle,
        boxShadow: boxShadow,
        fontSize: dimension * 0.4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        ...shapeStyle,
        padding: 0,
        cursor: onClick ? "pointer" : "default",
        ...style
      }}
      {...rest}
    >
      {renderContent()}
    </div>
  );
};

Avatar.Group = ({
  avatars = [],
  max = 3,
  size = "md",
  shape,
  colorType,
  background,
  color,
  border,
  borderColor,
  borderType,
  borderWeight,
  shadow,
  style,
  className,
  zIndexStart = 10,
  gap = 0.6,
  "aria-label": ariaLabel = "아바타 그룹"
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const hiddenAvatars = avatars.slice(max);

  const overlapOffset = useMemo(() => {
    const sizePx = {
      xs: 32,
      sm: 40,
      md: 48,
      lg: 56,
      xl: 64
    }[size];
    return Math.floor(sizePx * gap);
  }, [size, gap]);

  const dimension =
    typeof size === "number" ? size : SIZE_MAP[size] || SIZE_MAP.md;
  return (
    <div
      className={`sud-avatar-group ${className}`}
      role="group"
      aria-label={ariaLabel}
      style={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        ...style
      }}
    >
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className="sud-avatar-group-item"
          style={{
            marginLeft: index === 0 ? 0 : -overlapOffset,
            zIndex: zIndexStart - visibleAvatars.length + index
          }}
        >
          <Avatar
            size={size}
            shape={shape}
            colorType={colorType}
            background={background}
            color={color}
            border={border}
            borderColor={borderColor}
            borderType={borderType}
            borderWeight={borderWeight}
            shadow={shadow}
            {...avatar}
          />
        </div>
      ))}
      {hiddenAvatars.length > 0 && (
        <div
          className="sud-avatar-group-more"
          style={{ marginLeft: -overlapOffset, zIndex: zIndexStart }}
        >
          <PopupBase
            className="sud-avatar-group-more-popup"
            placement="top"
            trigger="hover"
            content={
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  maxWidth: "90vw",
                  padding: 8
                }}
              >
                {hiddenAvatars.map((avatar, idx) => (
                  <Avatar
                    key={idx}
                    size={size}
                    shape={shape}
                    colorType={colorType}
                    background={background}
                    color={color}
                    border={border}
                    borderColor={borderColor}
                    borderType={borderType}
                    borderWeight={borderWeight}
                    shadow={shadow}
                    {...avatar}
                  />
                ))}
              </div>
            }
          >
            <Avatar
              className="sud-avatar-group-more-avatar"
              size={size}
              shape={shape}
              colorType="warning"
              background="orange-1"
              color="orange-6"
            >
              <Typography
                pretendard="Black"
                style={{ fontSize: `${dimension * 0.4}px` }}
              >
                +{hiddenAvatars.length}
              </Typography>
            </Avatar>
          </PopupBase>
        </div>
      )}
    </div>
  );
};

Avatar.Group.displayName = "Avatar.Group";
