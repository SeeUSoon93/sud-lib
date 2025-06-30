"use client";

import { useState, useMemo } from "react";
import { Calendar } from "../dataDisplay/Calendar";
import { Input } from "../dataEntry/Input";
import dayjs from "dayjs";
import { CalendarOutline } from "sud-icons";
import { PopConfirm } from "../feedback/PopConfirm";

const sizeMap = {
  sm: 14,
  md: 16,
  lg: 18
};

export const DatePicker = ({
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
  placeholder = "날짜 선택",
  format = "YYYY-MM-DD",
  range = false,
  placement = "top",
  locale = "en",
  popConfirmProps = {},
  inputProps = {},
  color,
  background,
  border,
  borderColor,
  borderType,
  borderWeight,
  underline,
  calendarProps = {},
  id,
  ariaLabel,
  ariaRequired,
  ariaInvalid,
  ariaDescribedby,
  style = {}
}) => {
  const [open, setOpen] = useState(false);

  const displayText = useMemo(() => {
    if (!value) return "";
    if (range) {
      const start = value?.startDate;
      const end = value?.endDate;
      const startStr =
        start && dayjs(start).isValid() ? dayjs(start).format(format) : "";
      const endStr =
        end && dayjs(end).isValid() ? dayjs(end).format(format) : "";
      return [startStr, endStr].filter(Boolean).join(" ~ ");
    }
    return dayjs(value).isValid() ? dayjs(value).format(format) : "";
  }, [value, format, range]);

  const formatValueToText = (val) => {
    if (!val) return "";
    if (range) {
      const start = val?.startDate;
      const end = val?.endDate;
      const startStr =
        start && dayjs(start).isValid() ? dayjs(start).format(format) : "";
      const endStr =
        end && dayjs(end).isValid() ? dayjs(end).format(format) : "";
      return [startStr, endStr].filter(Boolean).join(" ~ ");
    }
    return dayjs(val).isValid() ? dayjs(val).format(format) : "";
  };

  const handleChange = (val) => {
    if (disabled || readOnly) return;
    const text = formatValueToText(val);
    onChange(val, text);

    const shouldClose = !range || (val?.startDate && val?.endDate);
    if (shouldClose) {
      setOpen(false);
      requestAnimationFrame(() => {
        setTimeout(() => setOpen(true), 0);
      });
    }
  };

  const startDate = range ? value?.startDate : undefined;
  const endDate = range ? value?.endDate : undefined;

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
        <Calendar
          value={range ? startDate : value}
          startDate={startDate}
          endDate={endDate}
          onChange={handleChange}
          range={range}
          size="miniView"
          locale={locale}
          {...calendarProps}
        />
      }
    >
      <Input
        colorType={colorType}
        background={background}
        color={color}
        border={border}
        borderColor={borderColor}
        borderType={borderType}
        borderWeight={borderWeight}
        underline={underline}
        shape={shape}
        shadow={shadow}
        size={size}
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
        suffix={<CalendarOutline size={sizeMap[size]} />}
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
