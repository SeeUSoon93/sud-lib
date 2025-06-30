"use client";

import { useState, useMemo } from "react";
import { Input } from "../dataEntry/Input";
import dayjs from "dayjs";
import { ClockOutline } from "sud-icons";
import { PopConfirm } from "../feedback/PopConfirm";
import { TimeSelector } from "./TimeSelector";

const sizeMap = {
  sm: 14,
  md: 16,
  lg: 18
};

export const TimePicker = ({
  colorType = "default",
  shape = "rounded",
  shadow = "sm",
  size = "md",
  disabled = false,
  readOnly = false,
  error,
  errorText,
  className = "",
  value,
  onChange = () => {},
  placeholder = "시간 선택",
  format = "HH:mm:ss",
  range = false,
  placement = "top",
  showSecond = false,
  use12Hours = false,
  step = 1,
  popConfirmProps = {},
  inputProps = {},
  color,
  background,
  border,
  borderColor,
  borderType,
  borderWeight,
  underline,
  timePickerProps = {},
  id,
  ariaLabel,
  ariaRequired,
  ariaInvalid,
  ariaDescribedby,
  style
}) => {
  const [open, setOpen] = useState(false);
  const actualFormat = useMemo(() => {
    if (format && !use12Hours) return format;
    return use12Hours
      ? showSecond
        ? "hh:mm:ss A"
        : "hh:mm A"
      : showSecond
      ? "HH:mm:ss"
      : "HH:mm";
  }, [format, use12Hours, showSecond]);

  const displayText = useMemo(() => {
    if (!value) return "";
    if (range) {
      const start = value?.startTime;
      const end = value?.endTime;
      const startStr =
        start && dayjs(start).isValid()
          ? dayjs(start).format(actualFormat)
          : "";
      const endStr =
        end && dayjs(end).isValid() ? dayjs(end).format(actualFormat) : "";
      return [startStr, endStr].filter(Boolean).join(" ~ ");
    }
    return dayjs(value).isValid() ? dayjs(value).format(actualFormat) : "";
  }, [value, actualFormat, range]);

  const formatValueToText = (val) => {
    if (!val) return "";
    if (range) {
      const start = val?.startTime;
      const end = val?.endTime;
      const startStr =
        start && dayjs(start).isValid()
          ? dayjs(start).format(actualFormat)
          : "";
      const endStr =
        end && dayjs(end).isValid() ? dayjs(end).format(actualFormat) : "";
      return [startStr, endStr].filter(Boolean).join(" ~ ");
    }
    return dayjs(val).isValid() ? dayjs(val).format(actualFormat) : "";
  };

  const handleChange = (val) => {
    if (disabled || readOnly) return;

    const text = formatValueToText(val);
    onChange(val, text);

    const hasAllTimeUnits = (d) =>
      dayjs(d).isValid() &&
      d.getHours?.() != null &&
      d.getMinutes?.() != null &&
      (!showSecond || d.getSeconds?.() != null);

    let shouldClose = false;

    if (!range) {
      shouldClose = hasAllTimeUnits(val);
    } else {
      shouldClose =
        hasAllTimeUnits(val?.startTime) && hasAllTimeUnits(val?.endTime);
    }

    if (shouldClose) {
      setOpen(false);
      requestAnimationFrame(() => {
        setTimeout(() => setOpen(true), 0);
      });
    }
  };

  const startTime = range ? value?.startTime : undefined;
  const endTime = range ? value?.endTime : undefined;

  return (
    <PopConfirm
      title={null}
      footer={null}
      placement={placement}
      open={open}
      onOpenChange={setOpen}
      shape={shape}
      shadow={shadow}
      {...popConfirmProps}
      content={
        <TimeSelector
          value={range ? { startTime, endTime } : value}
          onChange={handleChange}
          range={range}
          showSecond={showSecond}
          use12Hours={use12Hours}
          step={step}
          {...timePickerProps}
        />
      }
    >
      <Input
        colorType={colorType}
        shape={shape}
        shadow={shadow}
        size={size}
        background={background}
        color={color}
        border={border}
        borderColor={borderColor}
        borderType={borderType}
        borderWeight={borderWeight}
        underline={underline}
        disabled={disabled}
        readOnly={readOnly}
        error={error}
        errorText={errorText}
        className={className}
        id={id}
        ariaLabel={ariaLabel || placeholder}
        ariaRequired={ariaRequired}
        ariaInvalid={ariaInvalid}
        ariaDescribedby={ariaDescribedby}
        value={displayText}
        placeholder={placeholder}
        suffix={<ClockOutline size={sizeMap[size]} />}
        onClick={() => {
          if (disabled || readOnly) return;
          setOpen(false);
          setTimeout(() => setOpen(true), 0);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled && !readOnly) {
              setOpen(false);
              setTimeout(() => setOpen(true), 0);
            }
          }
        }}
        style={style}
        {...inputProps}
      />
    </PopConfirm>
  );
};
