"use client";

import { Button } from "../general/Button";
import {
  computeColorStyles,
  getShadowStyle,
  getShapeStyles,
  mergeClassNames
} from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";

export const Segmented = ({
  options = [],
  value,
  onChange,
  disabled = false,
  size = "md",
  block = false,
  colorType = "default",
  background,
  color,
  border,
  borderColor,
  borderType,
  borderWeight,
  shadow,
  shape = "rounded",
  style = {},
  className = "",
  name = "segmented-control",
  ...rest
}) => {
  const theme = useTheme();

  const getOptionValue = (opt) => (typeof opt === "object" ? opt.value : opt);
  const getOptionLabel = (opt) => (typeof opt === "object" ? opt.label : opt);
  const isDisabled = (opt) => typeof opt === "object" && opt.disabled;

  const { bgColor: wrapperBg } = computeColorStyles({
    fallback: "hovered",
    componentType: "etc"
  });

  const shapeStyle = getShapeStyles(shape, theme);
  const boxShadow = getShadowStyle(shadow, theme);

  const handleKeyDown = (e, val) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) {
        onChange?.(val);
      }
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={mergeClassNames("sud-segmented", className)}
      style={{
        display: "inline-flex",
        overflow: "hidden",
        background: wrapperBg,
        border: border
          ? `${borderWeight}px ${borderType} ${borderColor}`
          : "none",
        ...shapeStyle,
        padding: 3,
        width: block ? "100%" : "fit-content",
        boxShadow: boxShadow,
        ...style
      }}
      {...rest}
    >
      {options.map((opt, idx) => {
        const val = getOptionValue(opt);
        const label = getOptionLabel(opt);
        const isSelected = val === value;
        const isOptDisabled = disabled || isDisabled(opt);

        return (
          <Button
            key={val ?? idx}
            onClick={() => !isOptDisabled && onChange?.(val)}
            onKeyDown={(e) => handleKeyDown(e, val)}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isOptDisabled}
            tabIndex={isSelected ? 0 : -1}
            colorType={isSelected ? colorType : "text"}
            background={isSelected ? background : "transparent"}
            color={isSelected ? color : undefined}
            border={false}
            size={size}
            shadow="none"
            shape={shape}
            disabled={isOptDisabled}
            style={{
              flex: block ? 1 : "none",
              transition:
                "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease"
            }}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};
