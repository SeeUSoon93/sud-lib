"use client";

import React, { useState } from "react";
import { AngleDown } from "sud-icons";
import { useTheme } from "../../theme/ThemeContext";
import {
  computeColorStyles,
  resolveColor,
  mergeClassNames,
  getShapeStyles,
  getShadowStyle
} from "../../theme/themeUtils";
import { Typography } from "../general/Typography";

export const Collapse = ({
  items = [],
  openKeys: controlledOpenKeys,
  defaultOpenKeys = [],
  onChange,
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  headerColorType = "sub",
  headerBackground,
  headerColor,
  contentColorType = "default",
  contentBackground,
  contentColor,
  shadow = "sm",
  disabledKeys = [],
  className = "",
  size = "md",
  shape = "rounded",
  style = {},
  ...rest
}) => {
  const theme = useTheme();
  const [internalOpenKeys, setInternalOpenKeys] = useState(defaultOpenKeys);
  const openKeys = controlledOpenKeys ?? internalOpenKeys;

  const toggle = (key) => {
    const next = openKeys.includes(key)
      ? openKeys.filter((k) => k !== key)
      : [...openKeys, key];
    if (controlledOpenKeys === undefined) {
      setInternalOpenKeys(next);
    }
    onChange?.(next);
  };

  const {
    bgColor: headerBgColor,
    borColor: headerBorderColor,
    txtColor: headerTxtColor
  } = computeColorStyles({
    border: true,
    fallback: headerColorType
  });

  const { bgColor: contentBgColor, txtColor: contentTxtColor } =
    computeColorStyles({
      border: false,
      fallback: contentColorType
    });

  const finalHeaderBgColor = headerBackground
    ? resolveColor(headerBackground, theme)
    : headerBgColor;
  const finalHeaderTxtColor = headerColor
    ? resolveColor(headerColor, theme)
    : headerTxtColor;
  const finalBorderColor = borderColor
    ? resolveColor(borderColor, theme)
    : headerBorderColor;
  const finalContentBgColor = contentBackground
    ? resolveColor(contentBackground, theme)
    : contentBgColor;
  const finalContentTxtColor = contentColor
    ? resolveColor(contentColor, theme)
    : contentTxtColor;

  const finalBorderStyle =
    border && finalBorderColor
      ? `${borderWeight}px ${borderType} ${finalBorderColor}`
      : "none";

  const { bgColor: disabledBgColor, txtColor: disabledTxtColor } =
    computeColorStyles({
      border: false,
      fallback: "disabled"
    });

  const boxShadow = getShadowStyle(shadow, theme);
  const shapeStyle = getShapeStyles(shape, theme);
  const spacing = theme.spacing[size] || theme.spacing.md;

  const sizeStyle =
    theme.typography.fontSize[size === "md" ? "base" : size] ||
    theme.typography.fontSize.base;

  return (
    <div
      className={mergeClassNames("sud-collapse", className)}
      style={{
        border: finalBorderStyle,
        borderRadius: shapeStyle.borderRadius,
        boxShadow,
        overflow: "hidden",
        ...style
      }}
      {...rest}
    >
      {items.map((item, index) => {
        const isOpen = openKeys.includes(item.key);
        const isDisabled = disabledKeys.includes(item.key);

        return (
          <div
            key={item.key}
            className="sud-collapse__panel"
            style={{
              borderTop: index !== 0 ? `1px solid ${finalBorderColor}` : "none",
              background: finalHeaderBgColor,
              color: finalHeaderTxtColor
            }}
            role="region"
            aria-labelledby={`collapse-header-${item.key}`}
          >
            <div
              id={`collapse-header-${item.key}`}
              className="sud-collapse__header flex jus-bet item-cen cursor-pointer"
              onClick={() => {
                if (!isDisabled) toggle(item.key);
              }}
              style={{
                padding: spacing,
                cursor: isDisabled ? "not-allowed" : "pointer",
                height: sizeStyle.lineHeight,
                background: isDisabled ? disabledBgColor : finalHeaderBgColor,
                color: isDisabled ? disabledTxtColor : finalHeaderTxtColor,
                transition: "background 0.3s ease"
              }}
              role="button"
              aria-expanded={isOpen}
              aria-disabled={isDisabled}
              aria-controls={`collapse-content-${item.key}`}
            >
              <Typography
                as="div"
                pretendard="B"
                size={size === "md" ? "base" : size}
                color={isDisabled ? disabledTxtColor : finalHeaderTxtColor}
                className="sud-collapse__header-label"
              >
                {item.label}
              </Typography>
              <AngleDown
                size={16}
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  color: isDisabled ? disabledTxtColor : finalHeaderTxtColor
                }}
              />
            </div>
            <div
              id={`collapse-content-${item.key}`}
              className="sud-collapse__content"
              style={{
                height: isOpen ? "auto" : 0,
                overflow: "hidden",
                transition: "all 0.3s ease",
                padding: isOpen ? `${spacing} ${spacing}` : `0 ${spacing}`,
                background: finalContentBgColor,
                color: finalContentTxtColor
              }}
              role="region"
              aria-hidden={!isOpen}
            >
              {typeof item.children === "string" ? (
                <Typography as="div" size={"sm"} color={finalContentTxtColor}>
                  {item.children}
                </Typography>
              ) : (
                item.children
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
