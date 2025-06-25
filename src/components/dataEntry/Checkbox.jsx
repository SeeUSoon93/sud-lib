"use client";

import { useState, useRef } from "react";
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

function Checkbox({
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
  ariaDescribedby
}) {
  const theme = useTheme();

  const { bgColor } = computeColorStyles({
    border: false,
    fallback: colorType
  });

  const finalBgColor = color ? resolveColor(color, theme) : bgColor;

  const [checked, setChecked] = useState(defaultChecked || false);
  const [hovered, setHovered] = useState(false);
  const isControlled = controlled !== undefined;
  const isChecked = isControlled ? controlled : checked;
  const isVertical = labelPosition === "top" || labelPosition === "bottom";
  const iconWrapperRef = useRef();
  const iconRef = useRef();

  const borderColor =
    hovered || isChecked ? finalBgColor : resolveColor("cool-gray-3", theme);

  const toggle = (e) => {
    e.stopPropagation();
    if (disabled) return;
    const next = !isChecked;
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
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="checkbox"
      aria-checked={isChecked}
      aria-label={ariaLabel}
      aria-required={ariaRequired}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
      aria-disabled={disabled}
    >
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
          transition: "border-color 0.2s ease, background 0.2s ease"
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
}

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
  role = "checkboxgroup",
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
          disabled={disabled || itemDisabled.includes(val) || isItemDisabled}
          color={color}
          colorType={colorType}
          labelPosition={labelPosition}
          name={name}
          ariaLabel={label}
        >
          {label}
        </Checkbox>
      ))}
    </div>
  );
};

Checkbox.Group.displayName = "Checkbox.Group";

export { Checkbox };
