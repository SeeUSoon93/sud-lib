import React from "react";
import { computeColorStyles, adjustBrightness } from "../../theme/themeUtils";
import { Typography } from "../general/Typography";

export const DotSpinner = ({
  size = 40,
  colorType = "cerulean",
  text = false,
  style = {},
  ...rest
}) => {
  const { txtColor } = computeColorStyles({
    fallback: colorType,
    componentType: "tag"
  });

  const baseColor = txtColor;
  const colors = [
    adjustBrightness(baseColor, 0),
    adjustBrightness(baseColor, 30),
    adjustBrightness(baseColor, 60),
    adjustBrightness(baseColor, 90)
  ];

  const r = 2;

  const getAnimatedCircle = (cx, cy, animationName, fill, delay = "0s") => (
    <g
      style={{
        transformOrigin: "10px 10px",
        animation: `${animationName} 1s ease-in-out infinite`
      }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          animation: `pulse 1.2s ${delay} ease-in-out infinite`
        }}
      />
    </g>
  );

  return (
    <div
      style={{
        display: "inline-flex",
        gap: 8,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...style
      }}
      role="status"
      aria-label="로딩 중"
      {...rest}
    >
      <style>
        {`
          @keyframes bounce-top {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(0, 4px); }
          }

          @keyframes bounce-bottom {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(0, -4px); }
          }

          @keyframes bounce-left {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(4px, 0); }
          }

          @keyframes bounce-right {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-4px, 0); }
          }

          @keyframes spin-wrapper {
            0%   { transform: rotate(0deg) scale(1); }
            25%  { transform: rotate(90deg) scale(1.1); }
            50%  { transform: rotate(180deg) scale(0.95); }
            75%  { transform: rotate(270deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
          }
        `}
      </style>

      <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true">
        <g
          style={{
            transformOrigin: "10px 10px",
            animation: "spin-wrapper 1.5s linear infinite"
          }}
        >
          {getAnimatedCircle(10, 3, "bounce-top", colors[0], "0s")}
          {getAnimatedCircle(10, 17, "bounce-bottom", colors[2], "0.2s")}
          {getAnimatedCircle(3, 10, "bounce-left", colors[1], "0.1s")}
          {getAnimatedCircle(17, 10, "bounce-right", colors[3], "0.3s")}
        </g>
      </svg>

      {text && typeof text === "string" ? (
        <Typography size={size * 0.4} pretendard="R" color="cool-gray-7">
          {text}
        </Typography>
      ) : (
        text
      )}
    </div>
  );
};
