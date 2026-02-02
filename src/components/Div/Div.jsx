"use client";
import "../../index.css";
import React from "react";
import { applyPulseEffect } from "../../utils/styleUtils";
import { useTheme } from "../../theme/ThemeContext";
import {
  computeColorStyles,
  resolveColor,
  mergeClassNames,
  getShapeStyles,
  getShadowStyle
} from "../../theme/themeUtils";

export const Div = ({
  children,
  colorType = null,
  background = null,
  color = null,
  border = false,
  borderColor = null,
  borderType = "solid",
  borderWeight = 1,
  shape = "rounded",
  shadow = "sm",
  onClick,
  style,
  className,
  ...rest
}) => {
  const theme = useTheme();

  const { bgColor, txtColor, borColor } = computeColorStyles({
    border,
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

  const handleClick = (e) => {
    if (onClick) onClick(e);
  };

  return (
    <div
      className={mergeClassNames("sud-div", className)}
      style={{
        color: finalTxtColor,
        backgroundColor: finalBgColor,
        border: finalBorStyle,
        boxShadow,
        ...shapeStyle,
        ...style
      }}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </div>
  );
};
