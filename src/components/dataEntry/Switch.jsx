"use client";

import React, {
  useState,
  useRef,
  cloneElement,
  isValidElement,
  useId,
  useEffect
} from "react";
import {
  applyPulseEffect,
  pulseThumbScaleWithBounce
} from "../../utils/styleUtils";
import {
  computeColorStyles,
  resolveColor,
  getShadowStyle,
  mergeClassNames
} from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";
import { Typography } from "../general/Typography";

export const Switch = React.forwardRef(function Switch({
  checked: controlled,
  defaultChecked,
  onChange,
  disabled = false,
  onColor,
  offColor,
  onText,
  offText,
  onIcon,
  offIcon,
  shadow = "none",
  thumbColor,
  size = "md",
  colorType = "primary",
  className = "",
  style = {},
  id,
  ariaLabel,
  ...rest
}, ref) {
  const theme = useTheme();
  const [checked, setChecked] = useState(defaultChecked || false);
  const isControlled = controlled !== undefined;
  const isChecked = isControlled ? controlled : checked;
  const thumbRef = useRef();
  const trackRef = useRef();
  const [textWidth, setTextWidth] = useState(0);
  const [focused, setFocused] = useState(false);
  const onTextRef = useRef(null);
  const offTextRef = useRef(null);

  const autoId = useId(); // 자동으로 고정된 ID 생성됨 (SSR-safe)

  const switchId = id || autoId;
  const handleChange = (event) => {
    const next = event.target.checked;
    if (!isControlled) setChecked(next);
    onChange?.(next);

    if (thumbRef.current) {
      pulseThumbScaleWithBounce(thumbRef.current);
    }

    applyPulseEffect(trackRef.current);
  };

  const boxShadow = getShadowStyle(shadow, theme);
  const { bgColor: onBgColor } = computeColorStyles({
    theme,
    border: false,
    fallback: colorType,
    componentType: "button"
  });

  const resolvedOnColor = onColor ? resolveColor(onColor, theme) : onBgColor;

  const resolvedOffColor = offColor
    ? resolveColor(offColor, theme)
    : resolveColor("cool-gray-3", theme);
  const resolvedOffTextColor = offColor
    ? resolveColor("white-10", theme)
    : resolveColor("cool-gray-8", theme);

  const sizeMap = {
    sm: { height: 22, thumb: 18, fontSize: 12 },
    md: { height: 32, thumb: 28, fontSize: 14 },
    lg: { height: 40, thumb: 34, fontSize: 16 }
  };
  const { height, thumb, fontSize } = sizeMap[size] || sizeMap.md;

  useEffect(() => {
    if (onTextRef.current && offTextRef.current) {
      const onWidth = onTextRef.current.offsetWidth;
      const offWidth = offTextRef.current.offsetWidth;
      const finalWidth = Math.max(onWidth, offWidth) + thumb;
      setTextWidth(finalWidth);
    }
  }, [onText, offText, thumb]);

  return (
    <label
      className={mergeClassNames(
        "sud-switch",
        disabled ? "" : "sud-hover",
        className
      )}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        position: "relative"
      }}
    >
      <input
        {...rest}
        ref={ref}
        id={switchId}
        type="checkbox"
        role="switch"
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        onFocus={(event) => {
          setFocused(true);
          rest.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          rest.onBlur?.(event);
        }}
        aria-label={
          ariaLabel ??
          rest["aria-label"] ??
          (typeof onText === "string" && typeof offText === "string"
            ? `${onText} / ${offText}`
            : "Switch")
        }
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0
        }}
      />
      <div
        ref={trackRef}
        className="sud-switch__track"
        aria-hidden="true"
        style={{
        minWidth: height * 2,
        height,
        borderRadius: height / 2,
        background: isChecked ? resolvedOnColor : resolvedOffColor,
        overflow: "hidden",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        width: "fit-content",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        boxSizing: "border-box",
        fontSize,
        transition: "background 0.25s ease",
        outline: focused ? `2px solid ${resolvedOnColor}` : "none",
        outlineOffset: 2,
        ...style
      }}
    >
      {/* 숨겨진 측정용 요소들 */}
      <span
        ref={onTextRef}
        style={{ visibility: "hidden", position: "absolute" }}
      >
        {onText}
      </span>
      <span
        ref={offTextRef}
        style={{ visibility: "hidden", position: "absolute" }}
      >
        {offText}
      </span>

      {/* ON 상태일 땐 왼쪽 텍스트 */}
      {/** 텍스트 - ON */}
      <Typography
        as="span"
        className="sud-switch__label sud-switch__label-on"
        style={{
          padding: "0 4px",
          color: resolveColor("white-10", theme),
          transition: "all 0.25s ease",
          display: isChecked ? "block" : "none",
          minWidth: textWidth,
          textAlign: "center"
        }}
      >
        {onText}
      </Typography>

      {/** 썸 (변화 없음) */}
      <div
        className="sud-switch__thumb"
        ref={thumbRef}
        style={{
          width: thumb,
          height: thumb,
          borderRadius: "50%",
          background: thumbColor
            ? resolveColor(thumbColor, theme)
            : resolveColor("white-10", theme),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isChecked ? resolvedOnColor : resolvedOffColor,
          boxShadow,
          fontSize: thumb * 0.5,
          transition: "all 0.25s ease"
        }}
      >
        {isValidElement(isChecked ? onIcon : offIcon)
          ? cloneElement(isChecked ? onIcon : offIcon, {
              color: isChecked ? resolvedOnColor : resolvedOffColor
            })
          : isChecked
          ? onIcon
          : offIcon}
      </div>

      {/** 텍스트 - OFF */}
      <Typography
        as="span"
        className="sud-switch__label sud-switch__label-off"
        style={{
          padding: "0 4px",
          color: resolvedOffTextColor,
          transition: "all 0.25s ease",
          display: isChecked ? "none" : "block",
          minWidth: textWidth,
          textAlign: "center"
        }}
      >
        {offText}
      </Typography>
      </div>
    </label>
  );
});

Switch.displayName = "Switch";
