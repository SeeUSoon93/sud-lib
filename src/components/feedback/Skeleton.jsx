"use client";

import React from "react";
import { mergeClassNames, resolveColor } from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";

const toCss = (value) => (typeof value === "number" ? `${value}px` : value);

export const Skeleton = ({
  loading = true,
  active = false,
  avatar = false,
  title = true,
  paragraph = true,
  round = false,
  baseColor = "neutral-9",
  highlightColor = "neutral-8",
  ariaLabel = "Loading",
  className,
  style = {},
  children,
  ...rest
}) => {
  const theme = useTheme();

  if (!loading) return <>{children}</>;

  const titleConfig = title === true ? {} : title || null;
  const paragraphConfig = paragraph === true ? {} : paragraph || null;
  const avatarConfig = avatar === true ? {} : avatar || null;
  const rows = paragraphConfig ? paragraphConfig.rows ?? (avatarConfig ? 2 : 3) : 0;
  const rowWidth = (index) => {
    const width = paragraphConfig?.width;
    if (Array.isArray(width)) return width[index];
    if (index === rows - 1) return width ?? "61%";
    return undefined;
  };

  const blockClass = mergeClassNames("sud-skeleton__block", {
    "sud-skeleton__block--round": round
  });
  const avatarSize = toCss(avatarConfig?.size ?? 40);

  return (
    <div
      className={mergeClassNames(
        "sud-skeleton",
        { "sud-skeleton--active": active },
        className
      )}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
      style={{
        "--sud-skeleton-base": resolveColor(baseColor, theme),
        "--sud-skeleton-highlight": resolveColor(highlightColor, theme),
        ...style
      }}
      {...rest}
    >
      {avatarConfig && (
        <span
          className={mergeClassNames(blockClass, "sud-skeleton__avatar")}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarConfig.shape === "square" ? 6 : "50%"
          }}
        />
      )}
      <div className="sud-skeleton__content">
        {titleConfig && (
          <span
            className={mergeClassNames(blockClass, "sud-skeleton__title")}
            style={{ width: toCss(titleConfig.width ?? (avatarConfig ? "50%" : "38%")) }}
          />
        )}
        {Array.from({ length: rows }, (_, index) => (
          <span
            key={index}
            className={mergeClassNames(blockClass, "sud-skeleton__row")}
            style={{ width: toCss(rowWidth(index)) }}
          />
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
