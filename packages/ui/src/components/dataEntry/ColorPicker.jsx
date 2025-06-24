"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Select } from "../dataEntry/Select";
import { Input } from "../dataEntry/Input";
import { Slider } from "../dataEntry/Slider";
import { Card } from "../dataDisplay/Card";
import { Button } from "../general/Button";
import { PopConfirm } from "../feedback/PopConfirm";
import { mergeClassNames } from "../../theme/themeUtils";

const MODE_OPTIONS = [
  { value: "HEX", label: "HEX" },
  { value: "HSB", label: "HSB" },
  { value: "RGB", label: "RGB" }
];

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function hexToRgb(hex) {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

export const ColorPicker = ({
  color: externalColor = "#1677FF",
  onChange,
  open = false,
  setOpen = () => {},
  children,
  trigger = "click",
  placement = "bottom",
  style = { padding: 5 },
  className = "",
  size = "sm",
  popConfirmProps = {},
  selectProps = {},
  inputProps = {},
  sliderProps = {},
  cardProps = {},
  buttonProps = {},
  ...rest
}) => {
  const paletteRef = useRef();

  const [color, setColor] = useState(externalColor);
  const [hue, setHue] = useState(210);
  const [alpha, setAlpha] = useState(100);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hsb, setHsb] = useState({ h: 210, s: 100, b: 100 });
  const [rgb, setRgb] = useState({ r: 22, g: 119, b: 255 });

  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48
  };

  const updateAllFromRGB = useCallback(
    ({ r, g, b }) => {
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      const v = max / 255;
      const s = max === 0 ? 0 : (max - min) / max;
      let h = 0;
      if (max !== min) {
        switch (max) {
          case r:
            h = (g - b) / (max - min) + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / (max - min) + 2;
            break;
          case b:
            h = (r - g) / (max - min) + 4;
            break;
        }
        h *= 60;
      }
      setRgb({ r, g, b });
      setHsb({
        h: Math.round(h),
        s: Math.round(s * 100),
        b: Math.round(v * 100)
      });
      setHue(Math.round(h));
      const hex = rgbToHex(r, g, b);
      const rgba = `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
      setColor(rgba);
      onChange?.({
        hex,
        rgb: { r, g, b },
        hsb,
        alpha,
        rgba
      });
    },
    [onChange, alpha]
  );

  useEffect(() => {
    updateAllFromRGB(hexToRgb(externalColor));
  }, [externalColor]);

  const handleMouseMove = useCallback(
    (e) => {
      const rect = paletteRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
      setCursorPos({ x, y });

      const s = x / rect.width;
      const v = 1 - y / rect.height;
      const h = hue;

      const f = (n, k = (n + h / 60) % 6) =>
        v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
      const r = Math.round(f(5) * 255);
      const g = Math.round(f(3) * 255);
      const b = Math.round(f(1) * 255);
      updateAllFromRGB({ r, g, b });
    },
    [hue, updateAllFromRGB]
  );

  return (
    <PopConfirm
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      placement={placement}
      title={null}
      footer={null}
      {...popConfirmProps}
      content={
        <div
          className={mergeClassNames("sud-color-picker", className)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: 300,
            padding: "8px 0"
          }}
          role="dialog"
          aria-label="색상 선택기"
          {...rest}
        >
          <div
            ref={paletteRef}
            className="sud-color-picker__palette"
            onMouseDown={(e) => {
              handleMouseMove(e);
              const move = (e) => handleMouseMove(e);
              const up = () => {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
              };
              window.addEventListener("mousemove", move);
              window.addEventListener("mouseup", up);
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              handleMouseMove(touch);
              const move = (e) => handleMouseMove(e.touches[0]);
              const up = () => {
                window.removeEventListener("touchmove", move);
                window.removeEventListener("touchend", up);
              };
              window.addEventListener("touchmove", move);
              window.addEventListener("touchend", up);
            }}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "2 /1.5",
              borderRadius: 8,
              background: `linear-gradient(to right, #fff, rgba(255,255,255,0)), linear-gradient(to top, #000, transparent), hsl(${hue}, 100%, 50%)`,
              cursor: "crosshair"
            }}
            role="slider"
            aria-label="색상 선택"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={hue}
            tabIndex={0}
          >
            <div
              className="sud-color-picker__cursor"
              style={{
                position: "absolute",
                top: cursorPos.y - 5,
                left: cursorPos.x - 5,
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: "2px solid white",
                boxShadow: "0 0 0 1px black",
                pointerEvents: "none"
              }}
            />
          </div>

          <div
            className="sud-color-picker__controls"
            style={{
              display: "grid",
              gridTemplateColumns: "4fr 1fr",
              gap: 8,
              alignItems: "center"
            }}
          >
            <Input
              size="sm"
              value={rgbToHex(rgb.r, rgb.g, rgb.b)}
              onChange={(e) => {
                const hex = e.target.value;
                try {
                  const newRgb = hexToRgb(hex);
                  const max = Math.max(newRgb.r, newRgb.g, newRgb.b);
                  const min = Math.min(newRgb.r, newRgb.g, newRgb.b);
                  const v = max / 255;
                  const s = max === 0 ? 0 : (max - min) / max;
                  const x = s * 100;
                  const y = (1 - v) * 100;
                  setCursorPos({ x, y });
                  updateAllFromRGB(newRgb);
                } catch {}
              }}
              className="sud-color-picker__hex-input"
              style={{
                width: "100%"
              }}
              {...inputProps}
            />
            <Input
              size="sm"
              value={alpha}
              onChange={(e) => {
                const newAlpha = Number(e.target.value);
                setAlpha(newAlpha);
                const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${
                  newAlpha / 100
                })`;
                setColor(rgba);
                onChange?.({
                  hex: rgbToHex(rgb.r, rgb.g, rgb.b),
                  rgb,
                  hsb,
                  alpha: newAlpha,
                  rgba
                });
              }}
              style={{
                width: "100%"
              }}
              placeholder="100"
              className="sud-color-picker__alpha-input"
              {...inputProps}
            />
          </div>

          <Slider
            min={0}
            max={360}
            value={hue}
            size="md"
            onChange={(v) => {
              setHue(v);
              setHsb((prev) => ({ ...prev, h: v }));
              const h = v;
              const s = hsb.s / 100;
              const b = hsb.b / 100;

              const f = (n, k = (n + h / 60) % 6) =>
                b - b * s * Math.max(Math.min(k, 4 - k, 1), 0);
              const r = Math.round(f(5) * 255);
              const g = Math.round(f(3) * 255);
              const b2 = Math.round(f(1) * 255);
              updateAllFromRGB({ r, g, b: b2 });
            }}
            fill={false}
            trackColor={`linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)`}
            className="sud-color-picker__hue-slider"
            {...sliderProps}
          />

          <Slider
            min={0}
            max={100}
            value={alpha}
            size="md"
            onChange={(v) => {
              setAlpha(v);
              const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${v / 100})`;
              setColor(rgba);
              onChange?.({
                hex: rgbToHex(rgb.r, rgb.g, rgb.b),
                rgb,
                hsb,
                alpha: v,
                rgba
              });
            }}
            fill={false}
            trackColor={`linear-gradient(to right, transparent, ${color})`}
            className="sud-color-picker__alpha-slider"
            {...sliderProps}
          />

          <Card
            className="sud-color-picker__preview"
            style={{
              width: "100%",
              height: "50px",
              backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${
                alpha / 100
              })`
            }}
            {...cardProps}
          />
        </div>
      }
    >
      {children ? (
        children
      ) : (
        <Button
          size={size}
          style={style}
          className={mergeClassNames("sud-color-picker__trigger", className)}
          {...buttonProps}
        >
          <Card
            className="sud-color-picker__trigger-preview"
            background={color}
            style={{ width: sizeMap[size], height: sizeMap[size] }}
          />
        </Button>
      )}
    </PopConfirm>
  );
};
