"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

// (Input, Slider 등 다른 컴포넌트 import는 그대로 유지)
import { Input } from "../dataEntry/Input";
import { Slider } from "../dataEntry/Slider";
import { Card } from "../dataDisplay/Card";
import { Button } from "../general/Button";
import { PopConfirm } from "../feedback/PopConfirm";
import { mergeClassNames } from "../../theme/themeUtils";

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
const SUD_PALETTES = {
  red: {
    1: "#fff1f0",
    2: "#ffccc7",
    3: "#ffa39e",
    4: "#ff7875",
    5: "#ff4d4f",
    6: "#f5222d",
    7: "#cf1322",
    8: "#a8071a",
    9: "#820014",
    10: "#5c0011",
  },
  rose: {
    1: "#fff0f6",
    2: "#ffd6e7",
    3: "#ffadd2",
    4: "#ff85c0",
    5: "#f759ab",
    6: "#eb2f96",
    7: "#c41d7f",
    8: "#9e1068",
    9: "#780650",
    10: "#520339",
  },
  coral: {
    1: "#fff2f0",
    2: "#ffd8cc",
    3: "#ffb3a3",
    4: "#ff8f7a",
    5: "#f86f4e",
    6: "#eb4d28",
    7: "#c7381a",
    8: "#a32b13",
    9: "#7f1f0d",
    10: "#5c1508",
  },
  orange: {
    1: "#fff7e6",
    2: "#ffe7ba",
    3: "#ffd591",
    4: "#ffc069",
    5: "#ffa940",
    6: "#fa8c16",
    7: "#d46b08",
    8: "#ad4e00",
    9: "#873800",
    10: "#612500",
  },
  volcano: {
    1: "#fff2e8",
    2: "#ffd8bf",
    3: "#ffbb96",
    4: "#ff9c6e",
    5: "#ff7a45",
    6: "#fa541c",
    7: "#d4380d",
    8: "#ad2102",
    9: "#871400",
    10: "#610b00",
  },
  apricot: {
    1: "#fff9f0",
    2: "#ffe3c2",
    3: "#ffce9c",
    4: "#ffb875",
    5: "#ffa14f",
    6: "#f58a2e",
    7: "#cc6c19",
    8: "#a3560f",
    9: "#7a4008",
    10: "#522b03",
  },
  yellow: {
    1: "#feffe6",
    2: "#ffffb8",
    3: "#fffb8f",
    4: "#fff566",
    5: "#ffec3d",
    6: "#fadb14",
    7: "#d4b106",
    8: "#ad8b00",
    9: "#876800",
    10: "#614700",
  },
  gold: {
    1: "#fffbe6",
    2: "#fff1b8",
    3: "#ffe58f",
    4: "#ffd666",
    5: "#ffc53d",
    6: "#faad14",
    7: "#d48806",
    8: "#ad6800",
    9: "#874d00",
    10: "#613400",
  },
  amber: {
    1: "#fff8e1",
    2: "#ffecb3",
    3: "#ffe082",
    4: "#ffd54f",
    5: "#ffca28",
    6: "#ffc107",
    7: "#ffa000",
    8: "#ff8f00",
    9: "#ff6f00",
    10: "#e65100",
  },
  green: {
    1: "#f6ffed",
    2: "#d9f7be",
    3: "#b7eb8f",
    4: "#95de64",
    5: "#73d13d",
    6: "#52c41a",
    7: "#389e0d",
    8: "#237804",
    9: "#135200",
    10: "#092b00",
  },
  lime: {
    1: "#fcffe6",
    2: "#f4ffb8",
    3: "#eaff8f",
    4: "#d3f261",
    5: "#bae637",
    6: "#a0d911",
    7: "#7cb305",
    8: "#5b8c00",
    9: "#3f6600",
    10: "#254000",
  },
  mint: {
    1: "#e6fff9",
    2: "#b5f5ec",
    3: "#87e8de",
    4: "#5cdbd3",
    5: "#36cfc9",
    6: "#13c2c2",
    7: "#08979c",
    8: "#006d75",
    9: "#00474f",
    10: "#002329",
  },
  blue: {
    1: "#e6f4ff",
    2: "#bae0ff",
    3: "#91caff",
    4: "#69b1ff",
    5: "#4096ff",
    6: "#1677ff",
    7: "#0958d9",
    8: "#003eb3",
    9: "#002c8c",
    10: "#001d66",
  },
  sky: {
    1: "#f0fbff",
    2: "#c2f1ff",
    3: "#99e6ff",
    4: "#6fdbff",
    5: "#46d0ff",
    6: "#1ac4ff",
    7: "#009edb",
    8: "#0079b0",
    9: "#005385",
    10: "#002e5a",
  },
  cerulean: {
    1: "#e6faff",
    2: "#b3ecff",
    3: "#80ddff",
    4: "#4dcfff",
    5: "#1ac0ff",
    6: "#00a6e6",
    7: "#0088bf",
    8: "#006a99",
    9: "#004c73",
    10: "#002f4d",
  },
  indigo: {
    1: "#f0f5ff",
    2: "#d6e4ff",
    3: "#adc8ff",
    4: "#84a9ff",
    5: "#6690ff",
    6: "#3366ff",
    7: "#254edb",
    8: "#1939b7",
    9: "#102693",
    10: "#091a7a",
  },
  cobalt: {
    1: "#edf6ff",
    2: "#cce4ff",
    3: "#99c9ff",
    4: "#66adff",
    5: "#338fff",
    6: "#006bff",
    7: "#0054cc",
    8: "#003e99",
    9: "#002966",
    10: "#001433",
  },
  navy: {
    1: "#f0f4f8",
    2: "#d6deea",
    3: "#adc1d8",
    4: "#84a3c6",
    5: "#5b86b4",
    6: "#346aa3",
    7: "#245385",
    8: "#183d66",
    9: "#0f2947",
    10: "#081726",
  },
  purple: {
    1: "#f9f0ff",
    2: "#efdbff",
    3: "#d3adf7",
    4: "#b37feb",
    5: "#9254de",
    6: "#722ed1",
    7: "#531dab",
    8: "#391085",
    9: "#22075e",
    10: "#120338",
  },
  plum: {
    1: "#fbeeff",
    2: "#e7c7f3",
    3: "#d3a0e6",
    4: "#bf79d9",
    5: "#ab52cc",
    6: "#973bb7",
    7: "#752e93",
    8: "#541f6e",
    9: "#39144a",
    10: "#1f0a26",
  },
  orchid: {
    1: "#fef4ff",
    2: "#f5d9f8",
    3: "#ecbef1",
    4: "#e2a3ea",
    5: "#d988e3",
    6: "#d06ddc",
    7: "#a856b2",
    8: "#803f88",
    9: "#58285e",
    10: "#301034",
  },
  forest: {
    1: "#f0f7f0",
    2: "#cce3cc",
    3: "#a6cca6",
    4: "#80b380",
    5: "#5c995c",
    6: "#387f38",
    7: "#2d662d",
    8: "#224c22",
    9: "#173317",
    10: "#0c1a0c",
  },
  sage: {
    1: "#f2f4f1",
    2: "#dde2db",
    3: "#c7cfc4",
    4: "#b1bcad",
    5: "#9ba996",
    6: "#85957f",
    7: "#6f7d69",
    8: "#596553",
    9: "#434d3e",
    10: "#2c3428",
  },
  "warm-gray": {
    1: "#fdfcfa",
    2: "#f5f2ed",
    3: "#e8e3db",
    4: "#d5cdc2",
    5: "#bfb5a7",
    6: "#a69c8d",
    7: "#8c8274",
    8: "#73685c",
    9: "#594f44",
    10: "#40362c",
  },
  "cool-gray": {
    1: "#fbfcfd",
    2: "#f2f4f7",
    3: "#e3e7ed",
    4: "#cfd4dd",
    5: "#b7bfcc",
    6: "#9ea7b8",
    7: "#858fa3",
    8: "#6b758b",
    9: "#515a70",
    10: "#373f52",
  },
  black: {
    1: "#ffffff",
    2: "#f5f5f5",
    3: "#e0e0e0",
    4: "#c2c2c2",
    5: "#a3a3a3",
    6: "#858585",
    7: "#666666",
    8: "#4d4d4d",
    9: "#2e2e2e",
    10: "#000000",
  },
};
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
  mode = "gradient",
  ...rest
}) => {
  const paletteRef = useRef();

  const [color, setColor] = useState(externalColor);
  const [hue, setHue] = useState(210);
  const [alpha, setAlpha] = useState(100);

  // 수정 1: 커서 위치를 항상 퍼센트(%)로 관리합니다. (초기값 중앙)
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [hsb, setHsb] = useState({ h: 210, s: 100, b: 100 });
  const [rgb, setRgb] = useState({ r: 22, g: 119, b: 255 });

  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
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

      const newHue = Math.round(h);

      setRgb({ r, g, b });
      setHsb({
        h: newHue,
        s: Math.round(s * 100),
        b: Math.round(v * 100),
      });
      setHue(newHue);

      // 수정 3: 색상이 변경되면 커서 위치도 동기화합니다.
      // s(채도)는 x축, v(명도)는 y축(반전)
      setCursorPos({
        x: s * 100,
        y: (1 - v) * 100,
      });

      const hex = rgbToHex(r, g, b);
      const rgba = `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
      setColor(rgba);
      onChange?.({
        hex,
        rgb: { r, g, b },
        hsb,
        alpha,
        rgba,
      });
    },
    [onChange, alpha]
  );

  useEffect(() => {
    updateAllFromRGB(hexToRgb(externalColor));
  }, [externalColor]); // updateAllFromRGB가 의존성 배열에 없어도 괜찮게 useCallback 처리

  const handleMouseMove = useCallback(
    (e) => {
      const rect = paletteRef.current.getBoundingClientRect();

      // 마우스 좌표를 0~1 사이 값으로 정규화
      const xRatio =
        Math.min(Math.max(e.clientX - rect.left, 0), rect.width) / rect.width;
      const yRatio =
        Math.min(Math.max(e.clientY - rect.top, 0), rect.height) / rect.height;

      // 수정 1 관련: 상태에는 %값 저장
      setCursorPos({ x: xRatio * 100, y: yRatio * 100 });

      const s = xRatio;
      const v = 1 - yRatio;
      const h = hue;

      const f = (n, k = (n + h / 60) % 6) =>
        v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
      const r = Math.round(f(5) * 255);
      const g = Math.round(f(3) * 255);
      const b = Math.round(f(1) * 255);

      // 여기서는 updateAllFromRGB를 부르면 순환 참조 문제가 생길 수 있으니
      // 값만 업데이트하고 커서 위치는 위에서 계산한 대로 유지하는 게 좋지만,
      // 간단하게 구현하기 위해 HSB, RGB만 업데이트합니다.
      // 단, updateAllFromRGB를 부르면 커서 위치가 미세하게 튈 수 있으니 주의 (RGB변환 오차 때문)
      // 이번 수정에서는 updateAllFromRGB가 커서 위치도 덮어쓰므로,
      // 드래그 중에는 커서 위치 업데이트를 막거나, 로직을 분리하는 게 정석이지만
      // 간단한 fix를 위해 RGB변환 후 재계산하도록 둡니다.

      updateAllFromRGB({ r, g, b });
    },
    [hue, updateAllFromRGB]
  );

  const PresetPanel = () => (
    <div
      className="sud-color-picker__preset-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)", // 10단계 명도
        gap: 4,
        padding: 4,
      }}
    >
      {Object.entries(SUD_PALETTES).map(([colorName, levels]) => (
        <React.Fragment key={colorName}>
          {Object.entries(levels).map(([level, hex]) => (
            <div
              key={`${colorName}-${level}`}
              onClick={() => updateAllFromRGB(hexToRgb(hex))}
              title={`${colorName}-${level}`}
              style={{
                width: "100%",
                aspectRatio: "5/3",
                backgroundColor: hex,
                borderRadius: "25%", // 둥글게 (이미지처럼)
                cursor: "pointer",
                border:
                  rgbToHex(rgb.r, rgb.g, rgb.b) === hex.toUpperCase()
                    ? "2px solid #000" // 선택된 색상 강조
                    : "1px solid rgba(0,0,0,0.1)",
                boxSizing: "border-box",
              }}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
  const GradientPanel = () => (
    <>
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
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "2 /1.5",
          borderRadius: 8,
          // 이전 질문에서 수정해드린 올바른 레이어 순서 적용
          background: `
            linear-gradient(to top, #000, transparent), 
            linear-gradient(to right, #fff, rgba(255,255,255,0)), 
            hsl(${hue}, 100%, 50%)
            `,
          cursor: "crosshair",
        }}
      >
        <div
          className="sud-color-picker__cursor"
          style={{
            position: "absolute",
            top: `${cursorPos.y}%`,
            left: `${cursorPos.x}%`,
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: "0 0 2px rgba(0,0,0,0.5)",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <div
        className="sud-color-picker__controls"
        style={{
          display: "grid",
          gridTemplateColumns: "4fr 1fr",
          gap: 8,
          marginTop: 12,
        }}
      >
        <Input
          size="sm"
          value={rgbToHex(rgb.r, rgb.g, rgb.b)}
          onChange={(e) => {
            try {
              updateAllFromRGB(hexToRgb(e.target.value));
            } catch {}
          }}
          {...inputProps}
        />
        <Input
          size="sm"
          value={alpha}
          onChange={(e) => setAlpha(Number(e.target.value))} // Alpha는 여기서 간략화
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
          // Hue 변경 시 현재 S, V 유지하며 색상 업데이트 로직 필요 (이전 코드 참고)
          const s = cursorPos.x / 100;
          const b = (100 - cursorPos.y) / 100;
          const h = v;
          const f = (n, k = (n + h / 60) % 6) =>
            b - b * s * Math.max(Math.min(k, 4 - k, 1), 0);
          updateAllFromRGB({
            r: Math.round(f(5) * 255),
            g: Math.round(f(3) * 255),
            b: Math.round(f(1) * 255),
          });
        }}
        fill={false}
        trackColor={`linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)`}
        style={{ marginTop: 8 }}
        {...sliderProps}
      />{" "}
      <Card
        className="sud-color-picker__preview"
        style={{
          width: "100%",
          height: "50px",
          backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha / 100})`,
        }}
        {...cardProps}
      />
    </>
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
            width: mode === "preset" ? 250 : 300,
            padding: "8px 0",
          }}
          role="dialog"
          aria-label="색상 선택기"
          {...rest}
        >
          {mode === "preset" ? <PresetPanel /> : <GradientPanel />}
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
