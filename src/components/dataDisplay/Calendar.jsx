"use client";

import dayjs from "dayjs";
import React, { useState, useMemo, useEffect } from "react";
import { locale_en, locale_ko } from "../../utils/calendarLocales";
import { Button } from "../general/Button";
import { TriangleLeft, TriangleRight } from "sud-icons";
import { Typography } from "../general/Typography";
import { Select } from "../dataEntry/Select";
import { Segmented } from "./Segmented";
import { Empty } from "../feedback/Empty";
import { computeColorStyles, resolveColor } from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";
import { Tag } from "./Tag";
import { Card } from "./Card";

const getLocale = (localeProp) => {
  if (!localeProp) return locale_en;
  if (localeProp === "ko") return locale_ko;
  if (localeProp === "en") return locale_en;
  return localeProp;
};
const sizeMap = {
  lg: {
    headerFontSize: "clamp(18px, 2vw, 20px)",
    navButtonSize: 24,
    segmentedFont: "clamp(14px, 1.5vw, 16px)",
    selectFont: "clamp(14px, 1.5vw, 16px)",
    dayFontSize: "clamp(14px, 1.5vw, 16px)",
    itemFontSize: "clamp(12px, 1.2vw, 14px)",
    dotSize: 6,
    itemGap: 8,
    cellPadding: 8,
    headerPadding: "12px 16px"
  },
  md: {
    headerFontSize: "clamp(16px, 1.8vw, 18px)",
    navButtonSize: 20,
    segmentedFont: "clamp(12px, 1.3vw, 14px)",
    selectFont: "clamp(12px, 1.3vw, 14px)",
    dayFontSize: "clamp(12px, 1.3vw, 14px)",
    itemFontSize: "clamp(10px, 1.1vw, 12px)",
    dotSize: 5,
    itemGap: 6,
    cellPadding: 6,
    headerPadding: "10px 14px"
  },
  sm: {
    headerFontSize: "clamp(14px, 1.5vw, 16px)",
    navButtonSize: 16,
    segmentedFont: "clamp(11px, 1.2vw, 12px)",
    selectFont: "clamp(11px, 1.2vw, 12px)",
    dayFontSize: "clamp(11px, 1.2vw, 12px)",
    itemFontSize: "clamp(9px, 1vw, 10px)",
    dotSize: 4,
    itemGap: 4,
    cellPadding: 4,
    headerPadding: "8px 12px"
  },
  miniView: {
    headerFontSize: "clamp(12px, 1.2vw, 14px)",
    navButtonSize: 14,
    segmentedFont: "clamp(10px, 1.1vw, 12px)",
    selectFont: "clamp(10px, 1.1vw, 12px)",
    dayFontSize: "clamp(10px, 1.1vw, 12px)",
    itemFontSize: "clamp(8px, 0.9vw, 10px)",
    dotSize: 3,
    itemGap: 2,
    cellPadding: 2,
    headerPadding: "6px 10px"
  }
};
export const Calendar = ({
  value,
  onChange = () => {},
  items = [],
  view: defaultView = "month",
  viewControl = false,
  dateControl = false,
  headerRender, // 년/월 표시 및 prev/next 버튼 (기본 헤더 대체)
  viewControlRender, // Segmented (일/월/년 선택) 커스텀 렌더링
  dateControlRender, // 년/월/일 선택 커스텀 렌더링
  locale = "en",
  colorType = "sky",
  background,
  hoverBackground,
  color,
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  width,
  height,
  className,
  range = false,
  startDate: propStart,
  endDate: propEnd,
  size = "md",
  style = {},
  ...rest
}) => {
  const theme = useTheme();
  const resolvedLocale = getLocale(locale);
  const containerRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentSize, setCurrentSize] = useState(size);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        let newSize = size;
        if (width >= 700) newSize = "lg";
        else if (width >= 500) newSize = "md";
        else if (width >= 300) newSize = "sm";
        else newSize = "miniView";
        setCurrentSize(newSize);
        setContainerWidth(width);
      }
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [size]);

  const [sizeStyles, setSizeStyles] = useState(sizeMap[currentSize]);
  const [viewDate, setViewDate] = useState(dayjs(value || new Date()));

  const [startDate, setStartDate] = useState(
    propStart ? dayjs(propStart) : null
  );
  const [endDate, setEndDate] = useState(propEnd ? dayjs(propEnd) : null);

  const [hoverDate, setHoverDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs(value || new Date()));
  const [view, setView] = useState(defaultView);
  const [showYearMonthSelector, setShowYearMonthSelector] = useState(false);
  const [year, setYear] = useState(viewDate.year());
  const [month, setMonth] = useState(viewDate.month());
  const [day, setDay] = useState(viewDate.date());

  const [animating, setAnimating] = useState(false);

  const triggerAnimation = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 150); // 300ms 딱 fade 효과용
  };

  const updateDate = (newYear, newMonth, newDay) => {
    const finalDate = dayjs(new Date(newYear, newMonth, newDay));
    setYear(newYear);
    setMonth(newMonth);
    setDay(newDay);
    setViewDate(finalDate);
    setSelectedDate(finalDate);
  };

  const currentYear = dayjs().year();
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const daysInSelectedMonth = viewDate.daysInMonth();
  const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  useEffect(() => {
    if (value) {
      setSelectedDate(dayjs(value));
      setViewDate(dayjs(value));
    }
  }, [value]);

  useEffect(() => {
    if (propStart) setStartDate(dayjs(propStart));
    if (propEnd) setEndDate(dayjs(propEnd));
  }, [propStart, propEnd]);

  const isSameDate = (a, b) => {
    if (!a || !b) return false;
    return dayjs(a).isSame(dayjs(b), "day");
  };
  const handleViewChange = (v) => {
    triggerAnimation();
    setView(v);
    if (v === "daily") {
      setViewDate(selectedDate);
    }
  };
  const calendarGrid = useMemo(() => {
    const grid = [];
    const base = dayjs(viewDate);
    const startOfMonth = base.startOf("month");
    const startDay = startOfMonth.day(); // 0 ~ 6
    const prevMonthLastDate = startOfMonth.subtract(1, "day").date(); // 이전 달 마지막 날짜
    const daysInMonth = base.daysInMonth(); // 이 달의 총 날짜 수
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
      let cellDate;
      let inCurrentMonth = true;

      if (i < startDay) {
        const dateNum = prevMonthLastDate - (startDay - i - 1);
        cellDate = base.subtract(1, "month").date(dateNum);
        inCurrentMonth = false;
      } else if (i < startDay + daysInMonth) {
        const dateNum = i - startDay + 1;
        cellDate = base.date(dateNum);
      } else {
        const dateNum = i - (startDay + daysInMonth) + 1;
        cellDate = base.add(1, "month").date(dateNum);
        inCurrentMonth = false;
      }

      grid.push({ date: cellDate.toDate(), inCurrentMonth });
    }

    return grid;
  }, [viewDate]);

  const { bgColor, txtColor, borColor } = computeColorStyles({
    border,
    fallback: colorType,
    componentType: "tag"
  });

  const finalBgColor = background ? resolveColor(background, theme) : bgColor;
  const finalHoverBgColor = hoverBackground
    ? resolveColor(hoverBackground, theme)
    : resolveColor("neutral-2", theme);
  const finalTxtColor = color ? resolveColor(color, theme) : txtColor;
  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : borColor;
  const finalBorStyle =
    border && finalBorColor
      ? `${borderWeight}px ${borderType} ${finalBorColor}`
      : "none";

  const getDayColor = (dayIndex) => {
    if (dayIndex === 0 || dayIndex === 6) return resolveColor("red-6", theme);
    return "inherit";
  };

  const handleDateClick = (date) => {
    if (view === "year") {
      const newDate = dayjs(date).startOf("month");
      setViewDate(newDate);
      setView("month");
      return;
    }

    const dayjsDate = dayjs(date);

    if (!range) {
      setSelectedDate(dayjsDate);
      onChange(dayjsDate.toDate());
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(dayjsDate);
        setEndDate(null);
        onChange({ startDate: dayjsDate.toDate(), endDate: null });
      } else {
        const [start, end] = dayjsDate.isBefore(startDate)
          ? [dayjsDate, startDate]
          : [startDate, dayjsDate];
        setStartDate(start);
        setEndDate(end);
        onChange({ startDate: start.toDate(), endDate: end.toDate() });
      }
    }
  };

  const handlePrev = () => {
    triggerAnimation();
    if (view === "daily") {
      setViewDate(viewDate.subtract(1, "day"));
    } else if (view === "month") {
      setViewDate(viewDate.subtract(1, "month").startOf("month"));
    } else {
      setViewDate(viewDate.subtract(1, "year").startOf("month"));
    }
  };

  const handleNext = () => {
    triggerAnimation();
    if (view === "daily") {
      setViewDate(viewDate.add(1, "day"));
    } else if (view === "month") {
      setViewDate(viewDate.add(1, "month").startOf("month"));
    } else {
      setViewDate(viewDate.add(1, "year").startOf("month"));
    }
  };

  const handleKeyDown = (e, date) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleDateClick(date);
    }
  };

  const renderItems = (dayItems, isMiniView = false) => {
    if (isMiniView) {
      if (dayItems.length === 0) return null;
      if (dayItems.length === 1) {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: sizeStyles.dotSize,
                height: sizeStyles.dotSize,
                borderRadius: "50%",
                backgroundColor: finalTxtColor
              }}
            />
          </div>
        );
      }
      return (
        <div style={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <div
            style={{
              width: sizeStyles.dotSize,
              height: sizeStyles.dotSize,
              borderRadius: "50%",
              backgroundColor: finalTxtColor
            }}
          />
          <div
            style={{
              width: sizeStyles.dotSize,
              height: sizeStyles.dotSize,
              borderRadius: "50%",
              backgroundColor: finalTxtColor
            }}
          />
          {dayItems.length > 2 && (
            <Typography
              as="span"
              style={{
                fontSize: sizeStyles.itemFontSize,
                color: finalTxtColor
              }}
            >
              +{dayItems.length - 2}
            </Typography>
          )}
        </div>
      );
    }

    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "2/1",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          paddingLeft: 4,
          gap: sizeStyles.itemGap
        }}
      >
        {dayItems.map((item) => (
          <Tag
            key={item.key}
            colorType={item.colorType || "apricot"}
            style={{
              fontSize: sizeStyles.itemFontSize
            }}
          >
            <div
              style={{
                width: sizeStyles.dotSize,
                height: sizeStyles.dotSize,
                borderRadius: "50%",
                backgroundColor: finalTxtColor,
                marginRight: 4
              }}
            />
            <Typography
              as="span"
              style={{
                color: "inherit",
                fontSize: sizeStyles.itemFontSize,
                textAlign: "left",
                ...item.itemProps?.style
              }}
              {...item.itemProps}
            >
              {item.content}
            </Typography>
          </Tag>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`sud-calendar ${className || ""}`}
      role="application"
      aria-label="Calendar"
      style={{
        width: width || "100%",
        height: height || "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...style
      }}
      {...rest}
    >
      {headerRender ?? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: sizeStyles.itemGap,
            width: "100%",
            marginBottom: currentSize === "miniView" ? 4 : 8,
            justifyContent: "center",
            padding: sizeStyles.headerPadding
          }}
        >
          <Button
            onClick={handlePrev}
            size="sm"
            colorType="text"
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: currentSize === "miniView" ? "2px" : "4px"
            }}
            aria-label="Previous month"
          >
            <TriangleLeft size={sizeStyles.navButtonSize} />
          </Button>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              as="span"
              gmarket="Medium"
              onClick={() => setShowYearMonthSelector(!showYearMonthSelector)}
              style={{
                cursor: "pointer",
                fontSize: sizeStyles.headerFontSize,
                padding: `0 ${sizeStyles.itemGap}px`,
                textAlign: "center"
              }}
              role="heading"
              aria-level="2"
            >
              {resolvedLocale.yearFormat(viewDate)}
            </Typography>
            <Typography
              as="span"
              pretendard="SB"
              style={{
                fontSize: sizeStyles.headerFontSize,
                padding: `0 ${sizeStyles.itemGap}px`,
                textAlign: "center"
              }}
              role="heading"
              aria-level="2"
            >
              {view === "month" &&
                (resolvedLocale.monthFormat(viewDate) < 10
                  ? "0" + resolvedLocale.monthFormat(viewDate)
                  : resolvedLocale.monthFormat(viewDate))}
              {view === "daily" && (
                <>
                  {resolvedLocale.monthFormat(viewDate) < 10
                    ? "0" + resolvedLocale.monthFormat(viewDate)
                    : resolvedLocale.monthFormat(viewDate)}{" "}
                  -{" "}
                  {viewDate.date() < 10
                    ? "0" + viewDate.date()
                    : viewDate.date()}
                </>
              )}
            </Typography>
          </div>
          <Button
            onClick={handleNext}
            size="sm"
            colorType="text"
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: currentSize === "miniView" ? "2px" : "4px"
            }}
            aria-label="Next month"
          >
            <TriangleRight size={sizeStyles.navButtonSize} />
          </Button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: 8,
          gap: sizeStyles.itemGap
        }}
      >
        {viewControl &&
          (viewControlRender ?? (
            <Segmented
              options={
                locale === "ko"
                  ? [
                      { label: "일", value: "daily" },
                      { label: "월", value: "month" },
                      { label: "년", value: "year" }
                    ]
                  : [
                      { label: "Daily", value: "daily" },
                      { label: "Month", value: "month" },
                      { label: "Year", value: "year" }
                    ]
              }
              size={currentSize}
              value={view}
              onChange={handleViewChange}
              style={{
                fontSize: sizeStyles.segmentedFont
              }}
            />
          ))}

        {dateControl &&
          (dateControlRender ?? (
            <div
              style={{
                display: "flex",
                gap: sizeStyles.itemGap,
                fontSize: sizeStyles.selectFont
              }}
            >
              <Select
                value={viewDate.year()}
                onChange={(y) => updateDate(y, month, day)}
                options={years.map((y) => ({
                  label: `${y}`,
                  value: y
                }))}
                size="sm"
                style={{ maxWidth: 90 }}
              />
              <Select
                value={viewDate.month()}
                onChange={(m) => updateDate(year, m, day)}
                options={months.map((m) => ({
                  label: `${m}`,
                  value: m
                }))}
                size="sm"
                style={{ maxWidth: 60 }}
              />
              <Select
                value={viewDate.date()}
                onChange={(d) => updateDate(year, month, d)}
                options={days.map((d) => ({ label: `${d}`, value: d }))}
                size="sm"
                style={{ maxWidth: 60 }}
              />
            </div>
          ))}
      </div>

      <div
        style={{
          width: "100%",
          height: "100%",
          opacity: animating ? 0 : 1,
          transition: "opacity 0.3s ease"
        }}
      >
        {view === "daily" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: sizeStyles.itemGap
            }}
          >
            {items.length > 0 ? (
              <Card style={{ width: "100%" }} shadow="none">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {items
                    .filter(
                      (item) => item.date === viewDate.format("YYYY-MM-DD")
                    )
                    .map((item) => (
                      <Tag
                        key={item.key}
                        colorType={item.colorType || "apricot"}
                      >
                        <div
                          style={{
                            width: sizeStyles.dotSize,
                            height: sizeStyles.dotSize,
                            borderRadius: "50%",
                            backgroundColor: finalTxtColor,
                            marginRight: 6
                          }}
                        />
                        <Typography
                          as="span"
                          style={{
                            color: "inherit",
                            fontSize: sizeStyles.itemFontSize,
                            textAlign: "left",
                            ...item.itemProps?.style
                          }}
                          {...item.itemProps}
                        >
                          {item.content}
                        </Typography>
                      </Tag>
                    ))}
                </div>
              </Card>
            ) : (
              <Empty />
            )}
          </div>
        )}

        {view === "year" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: sizeStyles.itemGap * 2,
              width: "100%"
            }}
          >
            {Array.from({ length: 12 }, (_, m) => {
              const base = dayjs(viewDate);
              const monthDate = base.month(m);
              const yearMonthStr = monthDate.format("YYYY-MM");
              const monthItems = items.filter(
                (item) => item.date.slice(0, 7) === yearMonthStr
              );

              const isSelected = selectedDate.isSame(monthDate, "month");
              const isHovered =
                hoverDate && dayjs(hoverDate).isSame(monthDate, "month");

              const cellBg = isSelected
                ? finalBgColor
                : isHovered
                ? finalHoverBgColor
                : "transparent";

              const cellColor = isSelected ? finalTxtColor : "inherit";

              return (
                <div
                  key={m}
                  onClick={() => handleDateClick(monthDate.toDate())}
                  onMouseEnter={() => setHoverDate(monthDate.toDate())}
                  onMouseLeave={() => setHoverDate(null)}
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    backgroundColor: cellBg,
                    color: cellColor,
                    borderTop: finalBorStyle,
                    borderBottom: finalBorStyle,
                    padding: sizeStyles.cellPadding
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography
                      as="span"
                      pretendard="R"
                      style={{ fontSize: sizeStyles.dayFontSize }}
                    >
                      {resolvedLocale.monthFormat(monthDate)}
                    </Typography>
                  </div>

                  {renderItems(monthItems, currentSize === "miniView")}
                </div>
              );
            })}
          </div>
        )}

        {view === "month" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              {resolvedLocale.weekdays.map((w, index) => (
                <div key={w} style={{ padding: sizeStyles.cellPadding }}>
                  <Typography
                    as="span"
                    pretendard="B"
                    style={{
                      color: getDayColor(index),
                      fontSize: sizeStyles.dayFontSize
                    }}
                  >
                    {w}
                  </Typography>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                textAlign: "center"
              }}
            >
              {calendarGrid.map(({ date, inCurrentMonth }, i) => {
                const dayjsDate = dayjs(date);
                const isHovered = isSameDate(hoverDate, dayjsDate);
                const isSelected = isSameDate(selectedDate, dayjsDate);
                const dayIndex = dayjsDate.day();
                const isLastRow = i >= 35;
                const dateStr = dayjsDate.format("YYYY-MM-DD");
                const dayItems = items.filter((item) => item.date === dateStr);

                const isRangeEdge =
                  range &&
                  (dayjsDate.isSame(startDate, "day") ||
                    dayjsDate.isSame(endDate, "day"));
                const isInRange =
                  range &&
                  startDate &&
                  endDate &&
                  dayjsDate.isAfter(startDate, "day") &&
                  dayjsDate.isBefore(endDate, "day");
                const cellColor =
                  isRangeEdge || isSelected || isInRange
                    ? finalTxtColor
                    : inCurrentMonth
                    ? getDayColor(dayIndex)
                    : resolveColor("neutral-4", theme);

                const cellBg =
                  isRangeEdge || isSelected || isInRange
                    ? finalBgColor
                    : isHovered
                    ? finalHoverBgColor
                    : "transparent";

                return (
                  <div
                    key={i}
                    onClick={() => handleDateClick(dayjsDate.toDate())}
                    onKeyDown={(e) => handleKeyDown(e, dayjsDate.toDate())}
                    onMouseEnter={() => setHoverDate(dayjsDate.toDate())}
                    onMouseLeave={() => setHoverDate(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${dayjsDate.year()}년 ${
                      dayjsDate.month() + 1
                    }월 ${dayjsDate.date()}일`}
                    aria-selected={isRangeEdge || isSelected}
                    style={{
                      padding: sizeStyles.cellPadding,
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                      borderTop: finalBorStyle,
                      borderBottom: isLastRow ? finalBorStyle : "none",
                      border: currentSize === "miniView" && "none",
                      color: cellColor,
                      backgroundColor: cellBg
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: `${
                          currentSize === "miniView" ? "center" : "flex-end"
                        }`
                      }}
                    >
                      <Typography
                        as="span"
                        pretendard="R"
                        style={{ fontSize: sizeStyles.dayFontSize }}
                      >
                        {dayjsDate.date()}
                      </Typography>
                    </div>

                    {renderItems(dayItems, currentSize === "miniView")}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
