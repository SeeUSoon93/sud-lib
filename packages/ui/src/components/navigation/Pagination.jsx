"use client";

import { createElement as h, useMemo } from "react";
import { Button } from "../general/Button";
import {
  AngleDoubleLeft,
  AngleDoubleRight,
  AngleLeft,
  AngleRight
} from "sud-icons";
import { resolveColor } from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";
import { mergeClassNames } from "../../theme/themeUtils";
import React from "react";

export const Pagination = ({
  defaultCurrent = 1,
  total = 0,
  pageSize = 10,
  onChange,
  showPrevNext = true,
  showFirstLast = true,
  maxVisibleButtons = 5,
  activeStyle = { colorType: "primary", shadow: "sm" },
  defaultStyle = { colorType: "default", shadow: "sm" },
  style = {},
  align = "left",
  ...rest
}) => {
  const theme = useTheme();
  const [current, setCurrent] = React.useState(defaultCurrent);
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page) => {
    setCurrent(page);
    onChange?.(page);
  };

  const getAlignStyle = () => {
    switch (align) {
      case "center":
        return { justifyContent: "center" };
      case "right":
        return { justifyContent: "flex-end" };
      default:
        return { justifyContent: "flex-start" };
    }
  };

  const pages = useMemo(() => {
    if (totalPages <= maxVisibleButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const range = [];

    // 첫 페이지 근처
    if (current <= Math.ceil(maxVisibleButtons / 2)) {
      for (let i = 1; i <= maxVisibleButtons; i++) {
        range.push(i);
      }
      if (maxVisibleButtons < totalPages) {
        range.push("...");
      }
    }
    // 마지막 페이지 근처
    else if (current > totalPages - Math.floor(maxVisibleButtons / 2)) {
      range.push("...");
      for (let i = totalPages - maxVisibleButtons + 1; i <= totalPages; i++) {
        range.push(i);
      }
    }
    // 중간 페이지
    else {
      range.push("...");
      const half = Math.floor(maxVisibleButtons / 2);
      for (let i = current - half; i <= current + half; i++) {
        range.push(i);
      }
      range.push("...");
    }

    return range;
  }, [current, totalPages, maxVisibleButtons]);

  const renderButton = (page, index) => {
    if (page === "...") {
      return h(
        "span",
        {
          key: `ellipsis-${index}`,
          className: "sud-pagination__ellipsis",
          style: {
            color: resolveColor("cool-gray-6", theme),
            padding: "0 8px"
          }
        },
        "..."
      );
    }
    const isActive = page === current;
    const styleProps = isActive ? activeStyle : defaultStyle;

    return h(Button, {
      key: `page-${page}`,
      onClick: () => {
        if (page !== current) handlePageChange(page);
      },
      className: mergeClassNames(
        "sud-pagination__item",
        isActive && "sud-pagination__item--active"
      ),
      ...styleProps,
      children: page
    });
  };

  const navigationButtonStyle = {
    background: "transparent",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    borderRadius: 10,
    transition: "all 0.2s ease"
  };

  return h(
    "div",
    {
      className: "sud-pagination",
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        ...getAlignStyle(),
        ...style
      },
      role: "navigation",
      "aria-label": "페이지 네비게이션",
      ...rest
    },
    [
      showFirstLast &&
        h("div", {
          key: "first",
          className: "sud-pagination__nav sud-pagination__nav--first",
          onClick: current === 1 ? undefined : () => handlePageChange(1),
          style: {
            ...navigationButtonStyle,
            cursor: current === 1 ? "not-allowed" : "pointer",
            color:
              current === 1
                ? resolveColor("cool-gray-3", theme)
                : resolveColor("cool-gray-6", theme),
            "&:hover": {
              background:
                current === 1
                  ? "transparent"
                  : resolveColor("cool-gray-1", theme)
            }
          },
          role: "button",
          "aria-label": "첫 페이지로 이동",
          "aria-disabled": current === 1,
          children: <AngleDoubleLeft size="12" />
        }),
      showPrevNext &&
        h("div", {
          key: "prev",
          className: "sud-pagination__nav sud-pagination__nav--prev",
          onClick:
            current === 1 ? undefined : () => handlePageChange(current - 1),
          style: {
            ...navigationButtonStyle,
            cursor: current === 1 ? "not-allowed" : "pointer",
            color:
              current === 1
                ? resolveColor("cool-gray-3", theme)
                : resolveColor("cool-gray-6", theme),
            "&:hover": {
              background:
                current === 1
                  ? "transparent"
                  : resolveColor("cool-gray-1", theme)
            }
          },
          role: "button",
          "aria-label": "이전 페이지로 이동",
          "aria-disabled": current === 1,
          children: <AngleLeft size="12" />
        }),
      ...pages.map((page, index) => renderButton(page, index)),
      showPrevNext &&
        h("div", {
          key: "next",
          className: "sud-pagination__nav sud-pagination__nav--next",
          onClick:
            current === totalPages
              ? undefined
              : () => handlePageChange(current + 1),
          style: {
            ...navigationButtonStyle,
            cursor: current === totalPages ? "not-allowed" : "pointer",
            color:
              current === totalPages
                ? resolveColor("cool-gray-3", theme)
                : resolveColor("cool-gray-6", theme),
            "&:hover": {
              background:
                current === totalPages
                  ? "transparent"
                  : resolveColor("cool-gray-1", theme)
            }
          },
          role: "button",
          "aria-label": "다음 페이지로 이동",
          "aria-disabled": current === totalPages,
          children: <AngleRight size="12" />
        }),
      showFirstLast &&
        h("div", {
          key: "last",
          className: "sud-pagination__nav sud-pagination__nav--last",
          onClick:
            current === totalPages
              ? undefined
              : () => handlePageChange(totalPages),
          style: {
            ...navigationButtonStyle,
            cursor: current === totalPages ? "not-allowed" : "pointer",
            color:
              current === totalPages
                ? resolveColor("cool-gray-3", theme)
                : resolveColor("cool-gray-6", theme),
            "&:hover": {
              background:
                current === totalPages
                  ? "transparent"
                  : resolveColor("cool-gray-1", theme)
            }
          },
          role: "button",
          "aria-label": "마지막 페이지로 이동",
          "aria-disabled": current === totalPages,
          children: <AngleDoubleRight size="12" />
        })
    ]
  );
};
