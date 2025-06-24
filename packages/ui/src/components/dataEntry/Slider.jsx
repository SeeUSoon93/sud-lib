"use client";

import React, { useRef, useState, useEffect, useCallback, useId } from "react";
import {
  computeColorStyles,
  resolveColor,
  mergeClassNames,
  getShadowStyle
} from "../../theme/themeUtils";
import { applyPulseEffect } from "../../utils/styleUtils";
import { PopupBase } from "../navigation/base/PopupBase";
import { useTheme } from "../../theme/ThemeContext";
import { Typography } from "../general/Typography";

export const Slider = ({
  min = 0,
  max = 100,
  value = 0,
  step = 1,
  onChange,
  vertical = false,
  disabled = false,
  background,
  border = true,
  borderType = "solid",
  borderWeight = 1,
  borderColor,
  trackColor,
  fill = true,
  width,
  height,
  minMaxVisible = false,
  colorType = "primary",
  unit = "",
  style = {},
  className = "",
  shadow = "md",
  size = "sm",
  thumbSize,
  thumbBorder = true,
  popupClassName = "",
  popupStyle = {},
  popupProps = {},
  id,
  ariaLabel,
  ariaValueText,
  ...rest
}) => {
  const theme = useTheme();
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const autoId = useId();
  const sliderId = id || autoId;

  const { bgColor, borColor } = computeColorStyles({
    border,
    fallback: colorType,
    componentType: "button"
  });

  const boxShadow = getShadowStyle(shadow, theme);

  const finalBgColor = background ? resolveColor(background, theme) : bgColor;
  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : finalBgColor;
  const borderStyle = finalBorColor
    ? `${borderWeight}px ${borderType} ${finalBorColor}`
    : "none";

  const verticalSizeMap = {
    sm: { width: 8, height: 240, thumb: 16, fontSize: 14 },
    md: { width: 16, height: 320, thumb: 24, fontSize: 16 },
    lg: { width: 24, height: 400, thumb: 32, fontSize: 18 }
  };
  const horizontalSizeMap = {
    sm: { width: 240, height: 8, thumb: 16, fontSize: 14 },
    md: { width: 320, height: 16, thumb: 24, fontSize: 16 },
    lg: { width: 400, height: 24, thumb: 32, fontSize: 18 }
  };

  const {
    width: sizeWidth,
    height: sizeHeight,
    thumb,
    fontSize
  } = vertical ? verticalSizeMap[size] : horizontalSizeMap[size];

  const trackWidth = width || sizeWidth;
  const trackHeight = height || sizeHeight;

  const percent = ((internalValue - min) / (max - min)) * 100;

  useEffect(() => {
    if (!dragging) setInternalValue(value);
  }, [value, dragging]);

  const updateValue = useCallback(
    (clientX, clientY) => {
      const rect = trackRef.current.getBoundingClientRect();
      let ratio;

      if (vertical) {
        const offsetY = clientY - rect.top;
        ratio = 1 - offsetY / rect.height;
      } else {
        const offsetX = clientX - rect.left;
        ratio = offsetX / rect.width;
      }

      let newValue = min + ratio * (max - min);
      newValue = Math.round(newValue / step) * step;
      newValue = Math.min(max, Math.max(min, newValue));

      setInternalValue(newValue);
      onChange?.(newValue);
    },
    [min, max, step, onChange, vertical]
  );

  const handleMouseDown = (e) => {
    if (disabled) return;
    setDragging(true);
    applyPulseEffect(thumbRef.current);
    updateValue(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!dragging || disabled) return;
    updateValue(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    if (disabled) return;
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove]);

  const handleKeyDown = (e) => {
    if (disabled) return;

    let newValue = internalValue;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        newValue = Math.min(max, internalValue + step);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        newValue = Math.max(min, internalValue - step);
        break;
      case "Home":
        e.preventDefault();
        newValue = min;
        break;
      case "End":
        e.preventDefault();
        newValue = max;
        break;
      case "PageUp":
        e.preventDefault();
        newValue = Math.min(max, internalValue + step * 10);
        break;
      case "PageDown":
        e.preventDefault();
        newValue = Math.max(min, internalValue - step * 10);
        break;
      default:
        return;
    }

    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const filledStyle = vertical
    ? {
        position: "absolute",
        left: 0,
        width: "100%",
        height: `${percent}%`,
        background: finalBgColor,
        bottom: 0,
        boxShadow: boxShadow
      }
    : {
        position: "absolute",
        bottom: 0,
        height: "100%",
        width: `${percent}%`,
        background: finalBgColor,
        left: 0,
        boxShadow: boxShadow
      };

  const thumbStyle = {
    position: "absolute",
    border: `${
      thumbBorder ? (thumbSize ? thumbSize / 5 : thumb / 5) : 0
    }px solid ${resolveColor("white-9", theme)}`,
    boxShadow: boxShadow,
    background: finalBgColor,
    borderRadius: "50%",
    width: `${thumbSize ? thumbSize : thumb}px`,
    height: `${thumbSize ? thumbSize : thumb}px`,
    transform: "translate(-50%, -50%)",
    top: vertical ? `${100 - percent}%` : "50%",
    left: vertical ? "50%" : `${percent}%`,
    cursor: disabled ? "not-allowed" : "grab",
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const popupTriggerStyle = {
    position: "absolute",
    border: `2px solid transparent`,
    borderRadius: "50%",
    background: "transparent",
    width: `${thumbSize ? thumbSize : thumb}px`,
    height: `${thumbSize ? thumbSize : thumb}px`,
    transform: "translate(-50%, -50%)",
    top: vertical ? `${100 - percent}%` : "50%",
    left: vertical ? "50%" : `${percent}%`,
    zIndex: 4,
    pointerEvents: "auto"
  };

  return (
    <div
      className={mergeClassNames("sud-slider", className)}
      style={{
        position: "relative",
        width: vertical ? trackWidth : trackWidth,
        height: vertical ? trackHeight : trackHeight,
        maxWidth: "100%",
        minWidth: 0,
        ...style
      }}
      {...rest}
    >
      <div
        ref={trackRef}
        className="sud-slider__track"
        onMouseDown={handleMouseDown}
        style={{
          position: "relative",
          background: trackColor
            ? resolveColor(trackColor, theme)
            : resolveColor("cool-gray-2", theme),
          borderRadius: vertical ? trackWidth / 2 : trackHeight / 2,
          maxWidth: "100%",
          maxHeight: "100%",
          width: `${trackWidth}px`,
          height: `${trackHeight}px`
        }}
      >
        {fill && (
          <div
            className="su-hover sud-slider__filled"
            style={{
              borderRadius: vertical ? trackWidth / 2 : trackHeight / 2,
              ...filledStyle
            }}
          />
        )}
        <div
          className="su-hover sud-slider__thumb"
          ref={thumbRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={internalValue}
          aria-valuetext={
            ariaValueText || `${internalValue}${unit ? ` ${unit}` : ""}`
          }
          aria-orientation={vertical ? "vertical" : "horizontal"}
          aria-disabled={disabled}
          id={sliderId}
          onKeyDown={handleKeyDown}
          style={thumbStyle}
          onMouseDown={handleMouseDown}
        >
          <div
            className="sud-slider__thumb-inner"
            style={{
              width: `${thumbSize ? thumbSize - 10 : thumb - 10}px`,
              height: `${thumbSize ? thumbSize - 10 : thumb - 10}px`,
              borderRadius: "50%",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: boxShadow
            }}
          >
            <PopupBase
              placement="top"
              trigger="click"
              followTrigger={true}
              content={`${internalValue} ${unit}`}
              className={popupClassName}
              style={popupStyle}
              colorType={colorType}
              {...popupProps}
              variant="slider-popup"
            >
              <div
                className="sud-slider__popup-trigger"
                style={popupTriggerStyle}
              />
            </PopupBase>
          </div>
        </div>
      </div>
      {minMaxVisible && (
        <div
          className="sud-slider__range-labels"
          aria-hidden="true"
          style={{
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: vertical ? "auto" : "100%",
            height: vertical ? trackHeight : "auto",
            marginLeft: vertical ? 8 : 0,
            marginTop: vertical ? 0 : 8,
            fontSize: fontSize,
            color: disabled
              ? resolveColor("cool-gray-3", theme)
              : resolveColor("cool-gray-9", theme),
            position: vertical ? "absolute" : "relative",
            left: vertical ? "100%" : "auto",
            top: vertical ? 0 : "auto"
          }}
        >
          <Typography
            as="span"
            className="sud-slider__range-label"
            style={{
              whiteSpace: "nowrap",
              order: vertical ? 0 : 1
            }}
          >
            {max} {unit}
          </Typography>
          <Typography
            as="span"
            className="sud-slider__range-label"
            style={{
              whiteSpace: "nowrap",
              order: vertical ? 1 : 0
            }}
          >
            {min} {unit}
          </Typography>
        </div>
      )}
    </div>
  );
};
