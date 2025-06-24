"use client";

import { FileTrayFill } from "sud-icons";
import { Typography } from "../general/Typography";
import { mergeClassNames } from "../../theme/themeUtils";
import { cloneElement } from "react";
import { Div } from "../Div/Div";
export const Empty = ({
  icon = <FileTrayFill />,
  style = {},
  iconSize = "30",
  iconColor = "neutral-6",
  className = "",

  // Typography props
  description = "No Data",
  pretendard = "R",
  gmarket,
  suite,
  fontFamily,
  size = "base",
  weight = "normal",
  as = "span",
  color = "neutral-8",

  ...rest
}) => {
  const customIcon = icon ? cloneElement(icon, { size: iconSize }) : null;

  return (
    <div
      className={mergeClassNames("sud-empty", className)}
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        ...style
      }}
      role="status"
      aria-label="데이터가 없습니다"
      {...rest}
    >
      <Div color={iconColor}>{customIcon ?? defaultIcon}</Div>
      <Typography
        role="alert"
        pretendard={pretendard}
        gmarket={gmarket}
        suite={suite}
        fontFamily={fontFamily}
        size={size}
        weight={weight}
        color={color}
        as={as}
      >
        {description}
      </Typography>
    </div>
  );
};
