"use client";

import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import { computeColorStyles, useTheme } from "../../theme";
import { Typography } from "../general/Typography";

export const TimeSelector = ({
  value,
  onChange,
  range = false,
  use12Hours = false,
  showSecond = false,
  step = 1,
  colorType = "sky",
  hoverColorType = "hovered",
  ...rest
}) => {
  const theme = useTheme();
  const [hoverTime, setHoverTime] = useState(null);
  const [rangePhase, setRangePhase] = useState(0); // 0: start, 1: end

  const isRange = range;
  const is12 = use12Hours;
  const minuteStep = useMemo(() => {
    const numericStep = Number(step);

    if (!Number.isFinite(numericStep) || numericStep <= 0) return 1;

    return Math.min(60, Math.max(1, Math.floor(numericStep)));
  }, [step]);

  const getDisplayHour = (hour) => {
    if (hour == null) return null;
    if (!is12) return hour;

    const displayHour = hour % 12;
    return displayHour === 0 ? 12 : displayHour;
  };

  const getTimeParts = (time) => {
    if (!time || !dayjs(time).isValid())
      return { hour: null, minute: null, second: null };
    const d = dayjs(time);
    return {
      hour: getDisplayHour(d.hour()),
      minute: d.minute(),
      second: d.second(),
      ampm: d.hour() < 12 ? "AM" : "PM"
    };
  };

  const {
    hour: h1,
    minute: m1,
    second: s1,
    ampm: a1
  } = getTimeParts(isRange ? value?.startTime : value);
  const {
    hour: h2,
    minute: m2,
    second: s2,
    ampm: a2
  } = getTimeParts(value?.endTime);

  const selectedFromValue = useMemo(
    () => ({
      startTime: {
        hour: h1 ?? null,
        minute: m1 ?? null,
        second: s1 ?? null,
        ampm: a1 ?? "AM"
      },
      endTime: {
        hour: h2 ?? null,
        minute: m2 ?? null,
        second: s2 ?? null,
        ampm: a2 ?? "AM"
      }
    }),
    [a1, a2, h1, h2, m1, m2, s1, s2]
  );

  const [selected, setSelected] = useState(selectedFromValue);

  useEffect(() => {
    setSelected(selectedFromValue);
    setRangePhase(0);
  }, [selectedFromValue]);

  const hasCompleteTime = (time) =>
    time.hour != null &&
    time.minute != null &&
    (!showSecond || time.second != null);

  const buildDate = (time) =>
    dayjs()
      .hour(fixHour(time.hour, time.ampm))
      .minute(time.minute)
      .second(showSecond ? time.second ?? 0 : 0)
      .millisecond(0);

  const emitChange = (next, phase) => {
    if (!isRange) {
      if (hasCompleteTime(next.startTime)) {
        onChange?.(buildDate(next.startTime).toDate());
      }

      return;
    }

    if (phase === 0 && hasCompleteTime(next.startTime)) {
      setRangePhase(1);
      return;
    }

    if (phase === 1 && hasCompleteTime(next.endTime)) {
      const start = buildDate(next.startTime);
      let end = buildDate(next.endTime);

      if (end.isBefore(start)) {
        end = end.add(1, "day");
      }

      onChange?.({
        startTime: start.toDate(),
        endTime: end.toDate()
      });
    }
  };

  const hours = useMemo(() => {
    const base = is12 ? 12 : 24;
    return Array.from({ length: base }, (_, i) => i + (is12 ? 1 : 0));
  }, [is12]);

  const minutes = useMemo(() => {
    const values = [];

    for (let minute = 0; minute < 60; minute += minuteStep) {
      values.push(minute);
    }

    return values;
  }, [minuteStep]);

  const seconds = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  const fixHour = (hour, ampm) => {
    if (!is12) return hour;
    return ampm === "AM" ? hour % 12 : (hour % 12) + 12;
  };

  const handleSelect = (unit, value) => {
    const next = { ...selected };
    const target = isRange && rangePhase === 1 ? "endTime" : "startTime";

    next[target] = {
      ...next[target],
      [unit]: value
    };

    setSelected(next);
    emitChange(next, rangePhase);
  };

  const handleAmPmSelect = (type) => {
    const next = { ...selected };
    const target = isRange && rangePhase === 1 ? "endTime" : "startTime";

    next[target] = {
      ...next[target],
      ampm: type
    };

    setSelected(next);
    emitChange(next, rangePhase);
  };

  const { bgColor, txtColor } = computeColorStyles({
    theme,
    border: false,
    fallback: colorType,
    componentType: "tag"
  });

  const { bgColor: hoverBgColor } = computeColorStyles({
    theme,
    border: false,
    fallback: hoverColorType,
    componentType: "etc"
  });

  const renderColumn = (label, list, unit) => {
    const target = isRange && rangePhase === 1 ? "endTime" : "startTime";
    return (
      <div style={{ flex: 1, overflowY: "auto", maxHeight: 160, padding: 4 }}>
        {list.map((val) => {
          const formatted = val.toString().padStart(2, "0");
          const current = selected[target]?.[unit];
          const isSelected = current != null && current === val;
          const isHover = hoverTime && hoverTime[unit] === val;
          return (
            <div
              key={val}
              onClick={() => handleSelect(unit, val)}
              onMouseEnter={() => setHoverTime({ ...hoverTime, [unit]: val })}
              onMouseLeave={() => setHoverTime(null)}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                backgroundColor: isSelected
                  ? bgColor
                  : isHover
                  ? hoverBgColor
                  : "transparent",
                borderRadius: 6,
                textAlign: "center"
              }}
            >
              <Typography
                pretendard={`${isSelected ? "B" : "M"}`}
                size={14}
                color={isSelected ? txtColor : "inherit"}
              >
                {formatted}
              </Typography>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAmPmToggle = () => {
    const target = isRange && rangePhase === 1 ? "endTime" : "startTime";
    const current = selected[target].ampm;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {["AM", "PM"].map((type) => {
          const isSelected = type === current;
          return (
            <div
              key={type}
              onClick={() => handleAmPmSelect(type)}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                backgroundColor: isSelected ? bgColor : "transparent",
                borderRadius: 6,
                textAlign: "center"
              }}
            >
              <Typography
                pretendard={isSelected ? "B" : "M"}
                size={14}
                color={isSelected ? txtColor : "inherit"}
              >
                {type}
              </Typography>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 8,
        minWidth: 280
      }}
      {...rest}
    >
      {range && (
        <Typography gmarket="Medium" size={12} color="inherit">
          {rangePhase === 0 ? "시작 시간" : "종료 시간"}
        </Typography>
      )}
      <div style={{ display: "flex", gap: 8, width: "100%" }}>
        {is12 && renderAmPmToggle()}
        {renderColumn("시", hours, "hour")}
        {renderColumn("분", minutes, "minute")}
        {showSecond && renderColumn("초", seconds, "second")}
      </div>
    </div>
  );
};
