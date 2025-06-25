"use client";

import { useTheme } from "../../theme/ThemeContext";
import {
  computeColorStyles,
  resolveColor,
  getShadowStyle
} from "../../theme/themeUtils";

const SIZE_STYLE_MAP = {
  xs: {
    dot: { minWidth: 6, minHeight: 6 },
    default: { minWidth: 16, minHeight: 16, fontSize: 10, padding: 4 }
  },
  sm: {
    dot: { minWidth: 8, minHeight: 8 },
    default: { minWidth: 20, minHeight: 20, fontSize: 12, padding: 6 }
  },
  md: {
    dot: { minWidth: 10, minHeight: 10 },
    default: { minWidth: 24, minHeight: 24, fontSize: 12, padding: 6 }
  },
  lg: {
    dot: { minWidth: 12, minHeight: 12 },
    default: { minWidth: 28, minHeight: 28, fontSize: 14, padding: 8 }
  },
  xl: {
    dot: { minWidth: 14, minHeight: 14 },
    default: { minWidth: 32, minHeight: 32, fontSize: 14, padding: 8 }
  }
};

const getPositionStyle = (position, size, dot, offsetRatio, label) => {
  let sizeStyle;

  if (typeof size === "number") {
    sizeStyle = {
      minHeight: size,
      minWidth: dot ? size : size * 1.5,
      fontSize: Math.max(size * 0.4, 10),
      padding: `${Math.max(size * 0.2, 4)}px`
    };
  } else {
    sizeStyle = SIZE_STYLE_MAP[size][dot ? "dot" : "default"];
  }

  const offset = sizeStyle.minHeight * offsetRatio;
  const fixedOffset = -10;

  const POSITION_MAP = {
    "top-right": {
      top: offset,
      right: label ? fixedOffset : offset,
      transform: label ? "translate(0, -50%)" : "translate(50%, -50%)"
    },
    "top-left": {
      top: offset,
      left: label ? fixedOffset : offset,
      transform: label ? "translate(0, -50%)" : "translate(-50%, -50%)"
    },
    "bottom-right": {
      bottom: offset,
      right: label ? fixedOffset : offset,
      transform: label ? "translate(0, 50%)" : "translate(50%, 50%)"
    },
    "bottom-left": {
      bottom: offset,
      left: label ? fixedOffset : offset,
      transform: label ? "translate(0, 50%)" : "translate(-50%, 50%)"
    }
  };

  return {
    ...(POSITION_MAP[position] || POSITION_MAP["top-right"]),
    ...sizeStyle
  };
};

export const Badge = ({
  count,
  max,
  dot = false,
  showZero = false,
  position = "top-right",
  colorType = "red",
  background,
  color,
  shape = "circle",
  border = false,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  shadow = "none",
  size = "sm",
  offsetRatio = 0.25,
  label = false,
  className = "",
  style = {},
  children,
  "aria-label": ariaLabel,
  ...rest
}) => {
  const theme = useTheme();

  const { bgColor, txtColor, borColor } = computeColorStyles({
    border,
    fallback: colorType,
    componentType: "tag"
  });

  const finalBgColor = background ? resolveColor(background, theme) : txtColor;
  const finalTxtColor = color ? resolveColor(color, theme) : bgColor;
  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : borColor;
  const finalBorStyle =
    border && finalBorColor
      ? `${borderWeight}px ${borderType} ${finalBorColor}`
      : "none";

  const badgeContent = (() => {
    if (typeof count === "number") {
      if (typeof max === "number" && count > max) {
        return `${max}+`;
      }
      return count;
    }
    return count;
  })();

  const show =
    dot || (count !== null && count !== undefined && (count !== 0 || showZero));

  const getBadgeLabel = () => {
    if (ariaLabel) return ariaLabel;
    if (dot) return "알림 표시";
    if (typeof count === "number") {
      return `${count}개의 알림`;
    }
    return "알림";
  };

  return (
    <div
      className="sud-badge-wrapper"
      style={{ position: "relative", display: "inline-block" }}
      {...rest}
    >
      {children}
      {show && (
        <span
          className={`sud-badge ${className}`}
          role="status"
          aria-label={getBadgeLabel()}
          aria-live="polite"
          style={{
            position: "absolute",
            ...getPositionStyle(position, size, dot, offsetRatio, label),
            borderRadius:
              shape === "rounded" ? 4 : shape === "square" ? 0 : 999,
            background: finalBgColor,
            color: finalTxtColor,
            border: finalBorStyle,
            boxShadow: getShadowStyle(shadow, theme),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
            ...style
          }}
        >
          {!dot && badgeContent}
        </span>
      )}
    </div>
  );
};
