"use client";
import "../../index.css";

import {
  computeColorStyles,
  resolveColor,
  getShapeStyles,
  getShadowStyle,
  mergeClassNames
} from "../../theme/themeUtils";
import { Button } from "../general/Button";
import { Close } from "sud-icons";
import { useTheme } from "../../theme/ThemeContext";
import { Typography } from "../general/Typography";

export const Tag = ({
  children,
  colorType = "default",
  background,
  color,
  borderColor,
  borderType = "solid",
  borderWeight = "1",
  className = "",
  closeable = false,
  onClose = () => {},
  icon,
  iconPosition = icon ? "left" : "",
  shape = "rounded",
  shadow = "none",
  border = true,
  size = "sm", // 기본값 sm
  style = {},
  ...rest
}) => {
  const theme = useTheme();

  const { bgColor, txtColor, borColor } = computeColorStyles({
    border,
    fallback: colorType,
    componentType: "tag"
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

  const fontSizeMap = {
    sm: theme.typography.fontSize.sm,
    md: theme.typography.fontSize.base,
    lg: theme.typography.fontSize.lg
  };

  const paddingMap = {
    sm: "2px 6px",
    md: "4px 8px",
    lg: "6px 10px"
  };

  const sizeStyles = {
    fontSize: fontSizeMap[size] || theme.typography.fontSize.base,
    padding: paddingMap[size] || "4px 8px",
    iconSize: size === "sm" ? 6 : size === "md" ? 7 : 8,
    buttonSize: size === "sm" ? 12 : size === "md" ? 14 : 16
  };

  const contents =
    typeof children === "string" ? (
      <Typography as="span" pretendard="L" className="sud-tag__label">
        {children}
      </Typography>
    ) : (
      children
    );
  return (
    <div
      className={mergeClassNames("sud-tag", className)}
      style={{
        display: "inline-flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "fit-content",
        flexShrink: 0,
        fontSize: sizeStyles.fontSize,
        padding: sizeStyles.padding,
        backgroundColor: finalBgColor,
        color: finalTxtColor,
        border: finalBorStyle,
        boxShadow,
        gap: "4px",
        borderRadius: shapeStyle.borderRadius,
        ...style
      }}
      role="status"
      aria-label={typeof children === "string" ? children : undefined}
      {...rest}
    >
      {icon && iconPosition === "left" && icon}
      {contents}
      {icon && iconPosition === "right" && icon}
      {closeable && (
        <Button
          className="sud-tag__close"
          background={finalBgColor}
          color={finalTxtColor}
          border
          borderColor={finalTxtColor}
          shape="circle"
          icon={<Close size={sizeStyles.iconSize} color={finalTxtColor} />}
          style={{
            padding: 2,
            width: sizeStyles.buttonSize,
            height: sizeStyles.buttonSize
          }}
          onClick={onClose}
          aria-label="태그 닫기"
        />
      )}
    </div>
  );
};
