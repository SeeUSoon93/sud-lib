"use client";

import { useState, useMemo } from "react";
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
  const [selectedUnit, setSelectedUnit] = useState("hour");

  const [touchedUnits, setTouchedUnits] = useState({
    startTime: { hour: false, minute: false, second: false },
    endTime: { hour: false, minute: false, second: false }
  });

  const isRange = range;
  const is12 = use12Hours;
  const minuteStep = step;

  const getTimeParts = (time) => {
    if (!time || !dayjs(time).isValid())
      return { hour: null, minute: null, second: null };
    const d = dayjs(time);
    return {
      hour: d.hour(),
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

  const [selected, setSelected] = useState({
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
  });

  const hours = useMemo(() => {
    const base = is12 ? 12 : 24;
    return Array.from({ length: base }, (_, i) => i + (is12 ? 1 : 0));
  }, [use12Hours]);

  const minutes = useMemo(
    () => Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep),
    [step]
  );

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

    const nextTouched = {
      ...touchedUnits,
      [target]: {
        ...touchedUnits[target],
        [unit]: true
      }
    };

    setSelected(next);
    setTouchedUnits(nextTouched);

    const isComplete = (obj) => {
      return obj.hour && obj.minute && (!showSecond || obj.second);
    };

    if (!isRange && isComplete(nextTouched.startTime)) {
      const hour = fixHour(next.startTime.hour, next.startTime.ampm);
      const minute = next.startTime.minute;
      const second = showSecond ? next.startTime.second : 0;

      const result = dayjs().hour(hour).minute(minute).second(second).toDate();

      onChange?.(result);
    }

    if (isRange && rangePhase === 0 && isComplete(nextTouched.startTime)) {
      setRangePhase(1);
      setSelectedUnit("hour");
    }

    if (isRange && rangePhase === 1 && isComplete(nextTouched.endTime)) {
      let start = dayjs()
        .hour(fixHour(next.startTime.hour, next.startTime.ampm))
        .minute(next.startTime.minute)
        .second(showSecond ? next.startTime.second : 0);

      let end = dayjs()
        .hour(fixHour(next.endTime.hour, next.endTime.ampm))
        .minute(next.endTime.minute)
        .second(showSecond ? next.endTime.second : 0);

      if (end.isBefore(start)) {
        end = end.add(1, "day");
      }

      onChange?.({
        startTime: start.toDate(),
        endTime: end.toDate()
      });
    }
  };

  const handleAmPmSelect = (type) => {
    const next = { ...selected };
    const target = isRange && rangePhase === 1 ? "endTime" : "startTime";
    next[target].ampm = type;
    setSelected(next);
  };

  const { bgColor, txtColor } = computeColorStyles({
    border: false,
    fallback: colorType,
    componentType: "tag"
  });

  const { bgColor: hoverBgColor } = computeColorStyles({
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
