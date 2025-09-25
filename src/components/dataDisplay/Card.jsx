"use client";
import "../../index.css";

import { useTheme } from "../../theme/ThemeContext";
import {
  computeColorStyles,
  resolveColor,
  getShapeStyles,
  getShadowStyle,
  mergeClassNames
} from "../../theme/themeUtils";
import { Typography } from "../general/Typography";
import { Divider } from "../navigation/Divider";
import { Div } from "../Div/Div";
import { Close } from "sud-icons";

export const Card = ({
  title,
  children,
  footer,
  thumb,
  colorType = "default",
  background,
  color,
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  shape = "rounded",
  shadow = "sm",
  width,
  height,
  thumbHeight,
  className = "",
  style = {},
  variant = "card", // "card" | "drawer" | "modal" | "notification" | "toast"
  divider = false,
  dividerColor,
  isDrawer,
  onClose,
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

  const shapeStyle =
    variant === "drawer" || isDrawer ? {} : getShapeStyles(shape, theme);
  const boxShadow = getShadowStyle(shadow, theme);

  const spacing = theme.spacing;

  return (
    <div
      className={mergeClassNames(`sud-${variant}`, className)}
      style={{
        display: "flex",
        flexDirection: "column",
        width: width || "fit-content",
        height: height || "fit-content",
        background: finalBgColor,
        color: finalTxtColor,
        border: finalBorStyle,
        boxShadow,
        ...shapeStyle,
        padding: 0,
        overflow: "hidden",
        ...style
      }}
      {...rest}
    >
      {/* 타이틀 섹션 */}
      {title && (
        <div
          className={`sud-${variant}__title`}
          style={{ padding: spacing.md, width: "100%" }}
        >
          {typeof title === "string" ? (
            variant === "modal" ? (
              <div className="flex jus-bet item-cen">
                <Typography
                  as="h2"
                  size="lg"
                  pretendard="SB"
                  color={finalTxtColor}
                >
                  {title}
                </Typography>
                <Div color={finalTxtColor} style={{ cursor: "pointer" }}>
                  <Close size={20} onClick={onClose} />
                </Div>
              </div>
            ) : (
              <Typography
                as="h2"
                size="lg"
                pretendard="SB"
                color={finalTxtColor}
              >
                {title}
              </Typography>
            )
          ) : (
            title
          )}
        </div>
      )}
      {title && divider && (
        <Divider style={{ margin: 0 }} borderColor={dividerColor} />
      )}
      {/* 썸네일은 항상 타이틀 바로 아래 */}
      {thumb && (
        <div
          className={`sud-${variant}__thumbnail`}
          style={{
            width: "100%",
            height: thumbHeight || "auto",
            overflow: "hidden"
          }}
        >
          {typeof thumb === "string" ? (
            <img
              src={thumb}
              alt="thumbnail"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover"
              }}
            />
          ) : (
            thumb
          )}
        </div>
      )}

      {children &&
        (variant === "toast" ? (
          children 
        ) : (
          <div
            className={`sud-${variant}__body`}
            style={{
              padding: spacing.md,
              display: "flex",
              flexDirection: "column",
              gap: spacing.sm,
              width: "100%"
            }}
          >
            {children}
          </div>
        ))}
      {footer && divider && (
        <Divider style={{ margin: 0 }} borderColor={dividerColor} />
      )}
      {footer && (
        <div
          className={`sud-${variant}__footer`}
          style={{
            padding: spacing.md,
            width: "100%"
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
