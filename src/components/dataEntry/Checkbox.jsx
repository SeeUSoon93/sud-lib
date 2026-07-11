"use client";

import React, { useState, useRef } from "react";
import { Check } from "sud-icons";
import {
  applyPulseEffect,
  pulseThumbScaleWithBounce
} from "../../utils/styleUtils";
import {
  computeColorStyles,
  resolveColor,
  mergeClassNames
} from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";
import { Typography } from "../general/Typography";

const Checkbox = React.forwardRef(function Checkbox({
  checked: controlled,
  defaultChecked,
  onChange,
  labelPosition = "right", // "left" | "right" | "top" | "bottom"
  children,
  color,
  disabled = false,
  colorType = "primary",
  style = {},
  className = "",
  ariaLabel,
  ariaRequired,
  ariaInvalid,
  ariaDescribedby,
  ...rest
}, ref) {
  const theme = useTheme();

  const { bgColor } = computeColorStyles({
    theme,
    border: false,
    fallback: colorType
  });

  const finalBgColor = color ? resolveColor(color, theme) : bgColor;

  const [checked, setChecked] = useState(defaultChecked || false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isControlled = controlled !== undefined;
  const isChecked = isControlled ? controlled : checked;
  const isVertical = labelPosition === "top" || labelPosition === "bottom";
  const iconWrapperRef = useRef();
  const iconRef = useRef();

  const borderColor =
    hovered || isChecked ? finalBgColor : resolveColor("cool-gray-3", theme);

  const handleChange = (e) => {
    const next = e.target.checked;
    if (!isControlled) setChecked(next);
    onChange?.(next);

    if (iconWrapperRef.current) {
      applyPulseEffect(iconWrapperRef.current);
    }
    if (iconRef.current) {
      pulseThumbScaleWithBounce(iconRef.current);
    }
  };

  return (
    <label
      className={mergeClassNames(
        "sud-checkbox",
        disabled ? "" : "sud-hover",
        className
      )}
      style={{
        display: "flex",
        flexDirection: isVertical
          ? labelPosition === "top"
            ? "column-reverse"
            : "column"
          : labelPosition === "left"
          ? "row-reverse"
          : "row",
        alignItems: "center",
        gap: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...style
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        {...rest}
        ref={ref}
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        aria-label={ariaLabel ?? rest["aria-label"]}
        aria-required={ariaRequired ?? rest["aria-required"]}
        aria-invalid={ariaInvalid ?? rest["aria-invalid"]}
        aria-describedby={ariaDescribedby ?? rest["aria-describedby"]}
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
        ref={iconWrapperRef}
        className="sud-checkbox__box"
        style={{
          width: 20,
          height: 20,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: isChecked
            ? finalBgColor
            : resolveColor("white-10", theme),
          border: `1px solid ${borderColor}`,
          borderRadius: 4,
          transition: "border-color 0.2s ease, background 0.2s ease",
          outline: focused ? `2px solid ${finalBgColor}` : "none",
          outlineOffset: 2
        }}
      >
        <div
          ref={iconRef}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Check color={resolveColor("white-10", theme)} size="14" />
        </div>
      </div>
      {children &&
        (typeof children === "string" ? (
          <Typography
            as="span"
            className="sud-checkbox__label"
            color={color}
            style={{ whiteSpace: "nowrap" }}
          >
            {children}
          </Typography>
        ) : (
          children
        ))}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

Checkbox.Group = function CheckboxGroup({
  options = [],
  value = [],
  onChange,
  layout = "flex",
  direction = "vertical",
  cols = 1,
  gap = 8,
  disabled = false,
  itemDisabled = [],
  color,
  colorType = "primary",
  labelPosition = "right",
  ariaLabel,
  ariaRequired,
  name,
  role = "group",
  className = "",
  style = {}
}) {
  const toggle = (val) => {
    const next = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange?.(next);
  };

  const isHorizontal = direction === "horizontal";

  const containerStyle =
    layout === "grid"
      ? {
          display: "grid",
          gap,
          gridTemplateColumns: isHorizontal
            ? `repeat(${cols}, minmax(0, 1fr))`
            : "auto",
          gridTemplateRows: !isHorizontal ? `repeat(${cols}, auto)` : "auto",
          ...style
        }
      : {
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column",
          gap,
          flexWrap: "wrap",
          ...style
        };

  return (
    <div
      className={mergeClassNames("sud-checkbox-group", className)}
      style={containerStyle}
      role={role}
      aria-label={ariaLabel}
      aria-required={ariaRequired}
    >
      {options.map(({ value: val, label, disabled: isItemDisabled }) => (
        <Checkbox
          key={val}
          checked={value.includes(val)}
          onChange={() => toggle(val)}
          value={val}
          disabled={disabled || itemDisabled.includes(val) || isItemDisabled}
          color={color}
          colorType={colorType}
          labelPosition={labelPosition}
          name={name}
        >
          {label}
        </Checkbox>
      ))}
    </div>
  );
};

Checkbox.Group.displayName = "Checkbox.Group";

export { Checkbox };
