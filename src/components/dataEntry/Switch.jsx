"use client";

import {
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

export const Switch = ({
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
  shadow = "",
  thumbColor,
  size = "md",
  colorType = "primary",
  className = "",
  style = {},
  id,
  ariaLabel,
  ...rest
}) => {
  const theme = useTheme();
  const [checked, setChecked] = useState(defaultChecked || false);
  const isControlled = controlled !== undefined;
  const isChecked = isControlled ? controlled : checked;
  const thumbRef = useRef();
  const [textWidth, setTextWidth] = useState(0);
  const onTextRef = useRef(null);
  const offTextRef = useRef(null);

  const autoId = useId(); // 자동으로 고정된 ID 생성됨 (SSR-safe)

  const switchId = id || autoId;
  const toggle = (e) => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setChecked(next);
    onChange?.(next);

    if (thumbRef.current) {
      pulseThumbScaleWithBounce(thumbRef.current);
    }

    applyPulseEffect(e.currentTarget);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(e);
    }
  };

  const boxShadow = getShadowStyle(shadow, theme);
  const { bgColor: onBgColor } = computeColorStyles({
    border: false,
    fallback: colorType,
    componentType: "button"
  });

  const resolvedOnColor = onColor ? resolveColor(onColor, theme) : onBgColor;

  const resolvedOffColor = offColor
    ? resolveColor(offColor, theme)
    : resolveColor("cool-gray-3", theme);

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
    <div
      className={mergeClassNames(
        "sud-switch",
        disabled ? "" : "sud-hover",
        className
      )}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={isChecked}
      aria-label={ariaLabel || `${isChecked ? "활성화" : "비활성화"} 스위치`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      id={switchId}
      style={{
        minWidth: height * 2,
        height,
        borderRadius: height / 2,
        background: isChecked ? resolvedOnColor : resolvedOffColor,
        overflow: "hidden",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        width: "fit-content",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        boxSizing: "border-box",
        fontSize,
        transition: "background 0.25s ease",
        outline: "none",
        ...style
      }}
      {...rest}
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
          color: resolveColor("white-10", theme),
          transition: "all 0.25s ease",
          display: isChecked ? "none" : "block",
          minWidth: textWidth,
          textAlign: "center"
        }}
      >
        {offText}
      </Typography>
    </div>
  );
};
