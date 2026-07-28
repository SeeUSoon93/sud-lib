"use client";

import { createElement as h, useEffect, useMemo, useState } from "react";
import { Button } from "../general/Button";
import { AngleDoubleLeft, AngleDoubleRight, AngleLeft, AngleRight } from "sud-icons";
import { resolveColor, mergeClassNames } from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";

const positiveInteger = (value, fallback) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : fallback;
};

export const Pagination = ({
  current: controlledCurrent,
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
  const safePageSize = positiveInteger(pageSize, 10);
  const numericTotal = Number(total);
  const safeTotal =
    Number.isFinite(numericTotal) && numericTotal > 0
      ? Math.floor(numericTotal)
      : 0;
  const totalPages = Math.max(1, Math.ceil(safeTotal / safePageSize));
  const safeMaxVisible = Math.max(1, positiveInteger(maxVisibleButtons, 5));
  const isControlled = controlledCurrent !== undefined;
  const clampPage = (page) => Math.min(totalPages, Math.max(1, positiveInteger(page, 1)));
  const [internalCurrent, setInternalCurrent] = useState(() => clampPage(defaultCurrent));
  const requestedCurrent = isControlled ? controlledCurrent : internalCurrent;
  const current = clampPage(requestedCurrent);

  useEffect(() => {
    if (!isControlled && internalCurrent !== current) setInternalCurrent(current);
  }, [current, internalCurrent, isControlled]);

  const handlePageChange = (page) => {
    const next = clampPage(page);
    if (next === current) return;
    if (!isControlled) setInternalCurrent(next);
    onChange?.(next);
  };

  const pages = useMemo(() => {
    if (totalPages <= safeMaxVisible) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const range = [];
    const half = Math.floor(safeMaxVisible / 2);
    if (current <= Math.ceil(safeMaxVisible / 2)) {
      for (let i = 1; i <= safeMaxVisible; i += 1) range.push(i);
      range.push("...");
    } else if (current > totalPages - half) {
      range.push("...");
      for (let i = totalPages - safeMaxVisible + 1; i <= totalPages; i += 1) range.push(i);
    } else {
      range.push("...");
      const start = Math.max(1, current - half);
      const end = Math.min(totalPages, start + safeMaxVisible - 1);
      for (let i = end - safeMaxVisible + 1; i <= end; i += 1) range.push(i);
      range.push("...");
    }
    return range;
  }, [current, safeMaxVisible, totalPages]);

  const renderButton = (page, index) => {
    if (page === "...") {
      return h("span", { key: `ellipsis-${index}`, className: "sud-pagination__ellipsis", style: { color: resolveColor("cool-gray-6", theme), padding: "0 8px" }, "aria-hidden": true }, "...");
    }
    const isActive = page === current;
    return h(Button, {
      key: `page-${page}`,
      onClick: () => handlePageChange(page),
      className: mergeClassNames("sud-pagination__item", isActive && "sud-pagination__item--active"),
      "aria-current": isActive ? "page" : undefined,
      "aria-label": `${page} 페이지`,
      ...(!isActive ? defaultStyle : activeStyle),
      children: page
    });
  };

  const navigationButton = (key, label, icon, target, disabled) => h(Button, {
    key,
    className: mergeClassNames("sud-pagination__nav", `sud-pagination__nav--${key}`),
    onClick: () => handlePageChange(target),
    disabled,
    colorType: "text",
    icon,
    "aria-label": label,
    style: {
      padding: 0,
      minWidth: 24,
      width: 24,
      height: 24,
      color: disabled ? resolveColor("cool-gray-3", theme) : resolveColor("cool-gray-6", theme)
    }
  });

  const justifyContent = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
  const isFirst = current === 1;
  const isLast = current === totalPages;
  return h("div", {
    className: "sud-pagination",
    style: { display: "flex", alignItems: "center", gap: 10, width: "100%", justifyContent, ...style },
    role: "navigation",
    "aria-label": "페이지 네비게이션",
    ...rest
  }, [
    showFirstLast && navigationButton("first", "첫 페이지로 이동", <AngleDoubleLeft size="12" />, 1, isFirst),
    showPrevNext && navigationButton("prev", "이전 페이지로 이동", <AngleLeft size="12" />, current - 1, isFirst),
    ...pages.map(renderButton),
    showPrevNext && navigationButton("next", "다음 페이지로 이동", <AngleRight size="12" />, current + 1, isLast),
    showFirstLast && navigationButton("last", "마지막 페이지로 이동", <AngleDoubleRight size="12" />, totalPages, isLast)
  ]);
};
