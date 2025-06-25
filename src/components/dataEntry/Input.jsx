import {
  computeColorStyles,
  resolveColor,
  getShapeStyles,
  getShadowStyle,
  mergeClassNames
} from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";
import { useRef, useEffect, useState } from "react";
import { Typography } from "../general/Typography";

export const Input = ({
  background,
  color,
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  underline = false,
  afterIcon,
  beforeIcon,
  prefix,
  suffix,
  className = "",
  style = {},
  disabled = false,
  readOnly = false,
  autoFocus = false,
  password = false,
  maxLength,
  type = "text",
  clearable = false,
  placeholder,
  value = "",
  onChange = () => {},
  shape = "rounded",
  shadow = "sm",
  size = "md",
  id,
  name,
  autoComplete,
  ariaLabel,
  label,
  errorText,
  error = false,
  required = false,
  ariaRequired,
  ariaInvalid,
  ariaDescribedby,
  onClick,
  thousandSeparator = false
}) => {
  const theme = useTheme();
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(autoFocus);

  const { bgColor, txtColor, borColor } = computeColorStyles({
    border,
    fallback: error ? "error" : isFocused ? "focus" : "default",
    componentType: "input"
  });

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const finalBgColor = background ? resolveColor(background, theme) : bgColor;
  const finalTxtColor = color ? resolveColor(color, theme) : txtColor;
  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : borColor;
  const finalBorStyle =
    border && finalBorColor
      ? `${borderWeight}px ${borderType} ${finalBorColor}`
      : "none";

  const shapeStyle = getShapeStyles(shape, theme);
  const boxShadow = getShadowStyle(shadow, theme);

  const sizeStyles =
    {
      sm: { height: 32, fontSize: 14, padding: "4px" },
      md: { height: 38, fontSize: 16, padding: "6px" },
      lg: { height: 42, fontSize: 18, padding: "8px" }
    }[size] || {};

  const inputType = password ? "password" : type;

  const handleClear = () => {
    if (onChange) {
      onChange({ target: { value: "" } });
    }
  };

  const handleChange = (e) => {
    let newValue = e.target.value;

    if (thousandSeparator) {
      // 콤마 제거
      newValue = newValue.replace(/,/g, "");

      // 숫자로 변환 시도
      const numValue = Number(newValue);

      // 숫자가 아닌 경우 에러 처리
      if (newValue && isNaN(numValue)) {
        onChange({ target: { value: "" } });
        return;
      }

      // 숫자인 경우에만 콤마 추가
      if (!isNaN(numValue)) {
        newValue = numValue.toLocaleString();
      }
    }

    onChange({ target: { value: newValue } });
  };

  const displayValue = thousandSeparator ? value : value;
  const isThousandError =
    thousandSeparator && value && isNaN(Number(value.replace(/,/g, "")));
  const finalError = thousandSeparator ? isThousandError : error;
  const finalErrorText =
    thousandSeparator && isThousandError ? "숫자를 입력하세요" : errorText;

  return (
    <div
      style={{
        position: "relative",
        maxWidth: "100%",
        minWidth: 0,
        ...style
      }}
    >
      {label && (
        <label
          className="sud-input__label"
          htmlFor={id}
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 500,
            color: disabled
              ? resolveColor("cool-gray-3", theme)
              : resolveColor("cool-gray-9", theme)
          }}
          aria-label={ariaLabel}
          aria-required={ariaRequired}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
        >
          {typeof label === "string" ? (
            <Typography
              as="span"
              className="sud-input__label__text"
              size="sm"
              pretendard="B"
              color={finalTxtColor}
              style={{
                display: "block",
                marginBottom: 6,
                marginLeft: sizeStyles.padding
              }}
            >
              {label}
            </Typography>
          ) : (
            label
          )}
        </label>
      )}
      <div
        className={mergeClassNames(
          "sud-input",
          disabled ? "" : "sud-hover",
          className,
          `cursor-${disabled ? "not-allowed" : ""}`
        )}
        onClick={onClick}
        data-name={name}
        data-autocomplete={autoComplete}
        style={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: disabled
            ? resolveColor("cool-gray-1", theme)
            : finalBgColor,
          color: disabled ? resolveColor("cool-gray-3", theme) : finalTxtColor,
          ...shapeStyle,
          width: "fit-content",
          maxWidth: "100%",
          padding: sizeStyles.padding,
          boxShadow,
          ...(underline
            ? {
                border: "none",
                borderRadius: 0,
                borderBottom: finalBorStyle,
                boxShadow: "none"
              }
            : {
                border: finalBorStyle
              }),
          ...style
        }}
      >
        {prefix && (
          <div
            className="sud-input__prefix"
            style={{ marginRight: sizeStyles.padding }}
          >
            {prefix}
          </div>
        )}
        {beforeIcon && (
          <span
            className="sud-input__before-icon"
            style={{ marginRight: sizeStyles.padding }}
          >
            {beforeIcon}
          </span>
        )}

        <input
          ref={inputRef}
          className={`sud-input__field cursor-${disabled ? "not-allowed" : ""}`}
          type={thousandSeparator ? "text" : inputType}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          maxLength={maxLength}
          id={id}
          name={name}
          autoComplete={autoComplete}
          aria-label={ariaLabel || label}
          aria-required={ariaRequired || required}
          aria-invalid={ariaInvalid || finalError}
          aria-describedby={
            ariaDescribedby || (finalError ? `${id}-error` : undefined)
          }
          aria-disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            margin: 0,
            flex: 1,
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            color: finalTxtColor,
            fontSize: sizeStyles.fontSize,
            height: sizeStyles.height,
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        />

        {clearable && !readOnly && !disabled && value && (
          <button
            className="sud-input__clear"
            onClick={handleClear}
            type="button"
            style={{
              marginRight: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              color: finalTxtColor
            }}
          >
            ✕
          </button>
        )}
        {maxLength && (
          <div
            className="sud-input__length"
            style={{
              fontSize: 12,
              color: disabled
                ? resolveColor("cool-gray-3", theme)
                : resolveColor("sky-6", theme)
            }}
          >
            {value.length}/{maxLength}
          </div>
        )}
        {afterIcon && (
          <span
            className="sud-input__after-icon"
            style={{ marginLeft: sizeStyles.padding }}
          >
            {afterIcon}
          </span>
        )}
        {suffix && (
          <div
            className="sud-input__suffix"
            style={{ marginLeft: sizeStyles.padding }}
          >
            {suffix}
          </div>
        )}
      </div>
      {finalError && finalErrorText && (
        <div
          className="sud-input__error"
          style={{
            marginTop: 4,
            marginLeft: sizeStyles.padding
          }}
        >
          <Typography
            as="span"
            className="sud-input__error__text"
            size="xs"
            pretendard="B"
            color={finalTxtColor}
          >
            {finalErrorText}
          </Typography>
        </div>
      )}
    </div>
  );
};

export const Textarea = ({
  background,
  color,
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  underline = false,
  className = "",
  style = {},
  disabled = false,
  readOnly = false,
  autoFocus = false,
  placeholder,
  value = "",
  onChange = () => {},
  shape = "rounded",
  shadow = "sm",
  size = "md",
  rows = 4,
  maxLength,
  resizable = false,
  autoSize = false,
  bottomLeft,
  bottomRight,
  id,
  name,
  ariaLabel,
  spellCheck,
  label,
  errorText,
  error = false,
  required = false,
  ariaRequired,
  ariaInvalid,
  ariaDescribedby,
  onClick
}) => {
  const theme = useTheme();
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(autoFocus);
  const [isHovered, setIsHovered] = useState(false);

  const { bgColor, txtColor, borColor } = computeColorStyles({
    border,
    fallback: error ? "error" : isFocused ? "focus" : "default",
    componentType: "input"
  });

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const finalBgColor = background ? resolveColor(background, theme) : bgColor;
  const finalTxtColor = color ? resolveColor(color, theme) : txtColor;
  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : borColor;
  const finalBorStyle =
    border && finalBorColor
      ? `${borderWeight}px ${borderType} ${finalBorColor}`
      : "none";

  const shapeStyle = getShapeStyles(shape, theme);
  const boxShadow = getShadowStyle(shadow, theme);

  const sizeStyles =
    {
      sm: { height: 32, fontSize: 14, padding: "4px" },
      md: { height: 38, fontSize: 16, padding: "6px" },
      lg: { height: 42, fontSize: 18, padding: "8px" }
    }[size] || {};

  // ✨ autoSize 작동 로직 수정
  useEffect(() => {
    if (autoSize && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "0px";
      const scrollHeight = el.scrollHeight;
      el.style.height = scrollHeight + "px";
    }
  }, [value, autoSize]);

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        maxWidth: "100%",
        minWidth: 0,
        ...style
      }}
    >
      {label && (
        <label
          className="sud-textarea__label"
          htmlFor={id}
          style={{
            display: "block",
            marginBottom: 6,

            fontSize: 14,
            fontWeight: 500,
            color: disabled
              ? resolveColor("cool-gray-3", theme)
              : resolveColor("cool-gray-9", theme)
          }}
          aria-label={ariaLabel}
          aria-required={ariaRequired}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
        >
          {typeof label === "string" ? (
            <Typography
              as="span"
              size="sm"
              className="sud-textarea__label__text"
              pretendard="B"
              color={finalTxtColor}
              style={{
                display: "block",
                marginBottom: 6,
                marginLeft: sizeStyles.padding
              }}
            >
              {label}
            </Typography>
          ) : (
            label
          )}
        </label>
      )}
      <div
        className={mergeClassNames(
          "sud-textarea",
          disabled ? "" : "sud-hover",
          className,
          `cursor-${disabled ? "not-allowed" : ""}`
        )}
        onClick={onClick}
        data-name={name}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: disabled
            ? resolveColor("cool-gray-1", theme)
            : finalBgColor,
          color: disabled ? resolveColor("cool-gray-3", theme) : finalTxtColor,
          ...shapeStyle,
          width: "100%",
          padding: sizeStyles.padding,
          boxShadow,
          ...(underline
            ? {
                border: "none",
                borderRadius: 0,
                borderBottom: finalBorStyle,
                boxShadow: "none"
              }
            : {
                border: finalBorStyle
              }),
          ...style
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1
          }}
        >
          <textarea
            ref={textareaRef}
            className={`sud-textarea__field cursor-${
              disabled ? "not-allowed" : ""
            }`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            rows={rows}
            maxLength={maxLength}
            id={id}
            name={name}
            aria-label={ariaLabel || label}
            aria-required={ariaRequired || required}
            aria-invalid={ariaInvalid || error}
            aria-describedby={
              ariaDescribedby || (error ? `${id}-error` : undefined)
            }
            aria-disabled={disabled}
            spellCheck={spellCheck}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: "100%",
              margin: 0,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              color: finalTxtColor,
              fontSize: sizeStyles.fontSize,
              resize: resizable ? "vertical" : "none",
              minHeight: sizeStyles.height * rows,
              ...(autoSize
                ? {
                    height: "auto",
                    overflow: "hidden"
                  }
                : {
                    height: sizeStyles.height * rows
                  })
            }}
          />
        </div>
        {(bottomLeft || bottomRight || maxLength) && (
          <div
            className="sud-textarea__bottom"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
              fontSize: 12,
              color: disabled
                ? resolveColor("cool-gray-3", theme)
                : resolveColor("sky-6", theme)
            }}
          >
            <div className="sud-textarea__bottom-left">{bottomLeft}</div>
            <div
              className="sud-textarea__bottom-right"
              style={{ display: "flex", gap: 8 }}
            >
              {maxLength && (
                <span>
                  {value.length}/{maxLength}
                </span>
              )}
              <div className="sud-textarea__bottom-right-item">
                {bottomRight}
              </div>
            </div>
          </div>
        )}
      </div>
      {error && errorText && (
        <div
          className="sud-textarea__error"
          style={{
            marginTop: 4,
            marginLeft: sizeStyles.padding
          }}
        >
          <Typography
            as="span"
            size="xs"
            className="sud-textarea__error__text"
            pretendard="B"
            color={finalTxtColor}
          >
            {errorText}
          </Typography>
        </div>
      )}
    </div>
  );
};

export const OTP = ({
  background,
  color,
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  underline = false,
  className = "",
  style = {},
  disabled = false,
  readOnly = false,
  autoFocus = false,
  password = false,
  length = 6,
  type = "int",
  value = "",
  onChange = () => {},
  shape = "rounded",
  shadow = "sm",
  size = "md",
  id,
  name,
  ariaLabel,
  label,
  errorText,
  error = false,
  required = false,
  ariaRequired,
  ariaInvalid,
  ariaDescribedby,
  onClick
}) => {
  const theme = useTheme();
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(autoFocus ? 0 : -1);

  const { txtColor } = computeColorStyles({
    border,
    fallback: error ? "error" : "default",
    componentType: "input"
  });

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const finalTxtColor = color ? resolveColor(color, theme) : txtColor;

  const shapeStyle = getShapeStyles(shape, theme);
  const boxShadow = getShadowStyle(shadow, theme);

  const sizeStyles =
    {
      sm: { height: 32, fontSize: 14, padding: "4px" },
      md: { height: 38, fontSize: 16, padding: "6px" },
      lg: { height: 42, fontSize: 18, padding: "8px" }
    }[size] || {};

  const inputType = password ? "password" : type;

  const handleChange = (e, i) => {
    const val = e.target.value;
    if (type === "int" && !/^\d*$/.test(val)) return;

    const newValue = value.split("");
    newValue[i] = val;
    onChange({ target: { value: newValue.join("") } });

    if (val && i < length - 1) {
      inputRefs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      inputRefs.current[i - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (type === "int" && !/^\d*$/.test(pastedData)) return;

    const newValue = pastedData.slice(0, length).padEnd(length, "");
    onChange({ target: { value: newValue } });
  };

  return (
    <div
      style={{
        position: "relative",
        maxWidth: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        ...style
      }}
    >
      {label && (
        <label
          className="sud-input-otp__label"
          htmlFor={id}
          style={{
            display: "block",
            marginBottom: 6,

            fontSize: 14,
            fontWeight: 500,
            color: disabled
              ? resolveColor("cool-gray-3", theme)
              : resolveColor("cool-gray-9", theme)
          }}
          aria-label={ariaLabel}
          aria-required={ariaRequired}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
        >
          {typeof label === "string" ? (
            <Typography
              as="span"
              size="sm"
              className="sud-input-otp__label__text"
              pretendard="B"
              color={finalTxtColor}
              style={{
                display: "block",
                marginBottom: 6,
                marginLeft: sizeStyles.padding
              }}
            >
              {label}
            </Typography>
          ) : (
            label
          )}
        </label>
      )}
      <div
        className={mergeClassNames(
          "sud-input-otp",
          disabled ? "" : "sud-hover",
          className,
          `cursor-${disabled ? "not-allowed" : ""}`
        )}
        onClick={onClick}
        data-name={name}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
        onPaste={handlePaste}
      >
        {Array.from({ length }).map((_, i) => {
          const {
            bgColor: cellBg,
            txtColor: cellTxt,
            borColor: cellBor
          } = computeColorStyles({
            border,
            fallback: error
              ? "error"
              : focusedIndex === i
              ? "focus"
              : "default",
            componentType: "input"
          });
          const cellBgColor = background
            ? resolveColor(background, theme)
            : cellBg;
          const cellBorColor = borderColor
            ? resolveColor(borderColor, theme)
            : cellBor;
          const cellBorStyle =
            border && cellBorColor
              ? `${borderWeight}px ${borderType} ${cellBorColor}`
              : "none";
          return (
            <div
              key={i}
              className="sud-input-otp__field-wrapper"
              style={{
                width: sizeStyles.height,
                height: sizeStyles.height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: disabled
                  ? resolveColor("cool-gray-1", theme)
                  : cellBgColor,
                color: disabled ? resolveColor("cool-gray-3", theme) : cellTxt,
                ...(underline
                  ? {
                      border: "none",
                      borderRadius: 0,
                      borderBottom: cellBorStyle,
                      boxShadow: "none"
                    }
                  : {
                      border: cellBorStyle,
                      ...shapeStyle,
                      boxShadow
                    })
              }}
            >
              <input
                className="sud-input-otp__field"
                ref={(el) => (inputRefs.current[i] = el)}
                type={inputType}
                maxLength={1}
                value={value[i] || ""}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                disabled={disabled}
                readOnly={readOnly}
                autoFocus={autoFocus && i === 0}
                onFocus={() => setFocusedIndex(i)}
                onBlur={() => setFocusedIndex(-1)}
                style={{
                  width: "100%",
                  height: "100%",
                  fontSize: sizeStyles.fontSize,
                  textAlign: "center",
                  outline: "none",
                  border: "none",
                  backgroundColor: "transparent",
                  color: cellTxt
                }}
                aria-label={ariaLabel || label}
                aria-required={ariaRequired || required}
                aria-invalid={ariaInvalid || error}
                aria-describedby={
                  ariaDescribedby || (error ? `${id}-error` : undefined)
                }
                aria-disabled={disabled}
              />
            </div>
          );
        })}
      </div>
      {error && errorText && (
        <div
          className="sud-input-otp__error"
          style={{
            marginTop: 4,
            marginLeft: sizeStyles.padding
          }}
        >
          <Typography
            as="span"
            size="xs"
            className="sud-input-otp__error__text"
            pretendard="B"
            color={finalTxtColor}
          >
            {errorText}
          </Typography>
        </div>
      )}
    </div>
  );
};

Input.Textarea = Textarea;
Input.Textarea.displayName = "Textarea";

Input.OTP = OTP;
Input.OTP.displayName = "OTP";
