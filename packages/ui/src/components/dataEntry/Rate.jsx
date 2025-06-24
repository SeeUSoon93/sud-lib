"use client";

import { useState, useCallback, useMemo } from "react";
import { StarFill, HeartFill } from "sud-icons";
import { useTheme } from "../../theme/ThemeContext";
import {
  computeColorStyles,
  resolveColor,
  mergeClassNames
} from "../../theme/themeUtils";
import { Typography } from "../general/Typography";
import React from "react";

export const Rate = ({
  count = 5,
  allowHalf = true,
  defaultValue = 0,
  value: controlled,
  onChange,
  disabled = false,
  showValue = false,
  activeColor,
  inactiveColor,
  size = 24,
  className = "",
  style = {},
  ariaLabel = "별점 평가",
  testId = "rate",
  icon = "star",
  ...rest
}) => {
  const theme = useTheme();
  const [internal, setInternal] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState(null);
  const isControlled = controlled !== undefined;
  const selected = isControlled ? controlled : internal;

  const _colorType = useMemo(() => {
    if (typeof icon === "string") {
      return icon === "heart" ? "coral" : "gold";
    }
    return "gold";
  }, [icon]);

  const { bgColor: inactiveBg } = computeColorStyles({
    fallback: "hovered",
    componentType: "etc"
  });

  const finalActiveColor = useMemo(
    () =>
      activeColor
        ? resolveColor(activeColor, theme)
        : resolveColor(_colorType, theme),
    [activeColor, _colorType, theme]
  );

  const finalInactiveColor = useMemo(
    () => (inactiveColor ? resolveColor(inactiveColor, theme) : inactiveBg),
    [inactiveColor, inactiveBg, theme]
  );

  const renderIconBase = useCallback(
    (fillColor) => {
      if (React.isValidElement(icon))
        return React.cloneElement(icon, { color: fillColor, size });
      if (icon === "heart") return <HeartFill size={size} color={fillColor} />;
      return <StarFill size={size} color={fillColor} />;
    },
    [icon, size]
  );

  const renderIconHalfOverlay = useCallback(() => {
    const wrapperStyle = {
      position: "relative",
      width: size,
      height: size
    };

    const clipStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      clipPath: "inset(0 50% 0 0)",
      pointerEvents: "none"
    };

    return (
      <div style={wrapperStyle}>
        {renderIconBase(finalInactiveColor)}
        <div style={clipStyle}>{renderIconBase(finalActiveColor)}</div>
      </div>
    );
  }, [finalActiveColor, finalInactiveColor, size, renderIconBase]);

  const renderIcon = useCallback(
    (index) => {
      const current = hoverValue !== null ? hoverValue : selected;
      const isFull = current >= index + 1;
      const isHalf = !isFull && allowHalf && current >= index + 0.5;

      if (isFull) return renderIconBase(finalActiveColor);
      if (isHalf) return renderIconHalfOverlay();
      return renderIconBase(finalInactiveColor);
    },
    [
      hoverValue,
      selected,
      allowHalf,
      renderIconBase,
      renderIconHalfOverlay,
      finalActiveColor,
      finalInactiveColor
    ]
  );

  const handleChange = useCallback(
    (val) => {
      if (disabled) return;
      const final = allowHalf && hoverValue !== null ? hoverValue : val;
      if (!isControlled) setInternal(final);
      onChange?.(final);
    },
    [disabled, allowHalf, hoverValue, isControlled, onChange]
  );

  const handleMouseMove = useCallback(
    (e, index) => {
      if (disabled) return;
      const { left, width } = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - left) / width;
      const val = allowHalf
        ? percent < 0.5
          ? index + 0.5
          : index + 1
        : index + 1;
      setHoverValue(val);
    },
    [disabled, allowHalf]
  );

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    setHoverValue(null);
  }, [disabled]);

  const handleKeyDown = useCallback(
    (e) => {
      if (disabled) return;
      let next = selected;
      if (e.key === "ArrowRight") next = Math.min(selected + 1, count);
      else if (e.key === "ArrowLeft") next = Math.max(selected - 1, 0);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = count;
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [disabled, selected, count, isControlled, onChange]
  );

  return (
    <div
      className={mergeClassNames("sud-rate", className)}
      role="radiogroup"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        flexWrap: "wrap",
        ...style
      }}
      data-testid={testId}
      {...rest}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          role="radio"
          aria-checked={selected > i}
          aria-label={`${i + 1}점`}
          onClick={() => handleChange(i + 1)}
          onMouseMove={(e) => handleMouseMove(e, i)}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            width: size,
            height: size
          }}
          data-testid={`${testId}-star-${i + 1}`}
        >
          {renderIcon(i)}
        </div>
      ))}
      {showValue && (
        <Typography
          as="span"
          style={{ marginLeft: 8, fontSize: size * 0.8 }}
          color={disabled ? inactiveColor : activeColor}
          data-testid={`${testId}-value`}
        >
          {selected}
        </Typography>
      )}
    </div>
  );
};
