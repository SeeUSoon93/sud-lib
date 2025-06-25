import React from "react";
import { computeColorStyles } from "../../theme/themeUtils";
import { Typography } from "../general/Typography";

export const Spinner = ({
  size = 40,
  colorType = "cerulean",
  spinnerType = "default", // "default" | "elastic"
  text = false,
  style = {},
  ...rest
}) => {
  const strokeWidth = size / 25;
  const center = 12;
  const radius = center - strokeWidth * 1.5;
  const circumference = 2 * Math.PI * radius;

  const { txtColor } = computeColorStyles({
    fallback: colorType,
    componentType: "tag"
  });

  const { bgColor } = computeColorStyles({
    fallback: "hovered",
    componentType: "etc"
  });

  const animation =
    spinnerType === "elastic"
      ? "elasticSpin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite"
      : "spin 1s linear infinite";

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes elasticSpin {
            0%   { transform: rotate(0deg) scale(1); }
            50%  { transform: rotate(180deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
          }
        `}
      </style>

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
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={bgColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={txtColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.25} ${circumference}`}
            strokeDashoffset={0}
            style={{
              transformOrigin: "12px 12px",
              animation
            }}
          />
        </svg>

        {text && typeof text === "string" ? (
          <Typography size={size * 0.4} pretendard="R" color="cool-gray-7">
            {text}
          </Typography>
        ) : (
          text
        )}
      </div>
    </>
  );
};
