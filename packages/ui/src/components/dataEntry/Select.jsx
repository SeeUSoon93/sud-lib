"use client";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback
} from "react";
import { createPortal } from "react-dom";
import {
  computeColorStyles,
  resolveColor,
  getShapeStyles,
  getShadowStyle,
  mergeClassNames
} from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";
import { Tag } from "../dataDisplay/Tag";
import { Typography } from "../general/Typography";
import { Close, AngleDown } from "sud-icons";

export const Select = ({
  background,
  color,
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  underline = false,
  beforeIcon = <AngleDown size={16} />,
  afterIcon,
  className = "",
  style = {},
  value,
  onChange = () => {},
  shape = "rounded",
  shadow = "sm",
  size = "md",
  id,
  tagColorType = "default",
  colorType = "default",
  label,
  errorText,
  error = false,
  clearable = false,
  disabled = false,
  readOnly = false,
  dropdownStyle = {},
  searchable = false,
  multiMode = false,
  showSelectedCount = false,
  options = [],
  placeholder = "선택하세요",
  ariaLabel,
  ariaRequired,
  ariaInvalid,
  ariaDescribedby,
  ...rest
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownWidth, setDropdownWidth] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0
  });

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const optionRefs = useRef([]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedItems = multiMode
    ? options.filter((opt) => Array.isArray(value) && value.includes(opt.value))
    : options.find((opt) => opt.value === value);

  const handleClickOutside = useCallback((e) => {
    if (
      !wrapperRef.current?.contains(e.target) &&
      !dropdownRef.current?.contains(e.target)
    ) {
      setOpen(false);
    }
  }, []);

  const handleEscClose = useCallback((e) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  const handleSelect = useCallback(
    (item) => {
      if (disabled || readOnly) return;

      if (multiMode) {
        const current = Array.isArray(value) ? value : [];
        const exists = current.includes(item.value);
        const next = exists
          ? current.filter((v) => v !== item.value)
          : [...current, item.value];
        onChange(next);

        // ✅ 선택 후 검색어 초기화
        setSearch("");

        // ✅ 포커스 복원 (검색 계속 가능하게)
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      } else {
        onChange(item.value);
        setSearch("");
        setOpen(false);
      }
    },
    [
      disabled,
      readOnly,
      multiMode,
      value,
      onChange,
      setSearch,
      setOpen,
      inputRef
    ]
  );

  // 키보드 탐색 핸들러
  const handleKeyDown = useCallback(
    (e) => {
      // 일반 문자 입력 처리 (검색 기능)
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (!open) {
          setOpen(true);
        }
        // input에 포커스 이동
        inputRef.current?.focus();
        return;
      }

      if (!open) {
        if (e.key === "Enter" || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setFocusedIndex(0);
          // input에 포커스 이동
          inputRef.current?.focus();
          return;
        }
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          // input에 포커스 이동
          inputRef.current?.focus();
          setFocusedIndex((prev) => {
            const next = prev + 1;
            return next >= filteredOptions.length ? 0 : next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          // input에 포커스 이동
          inputRef.current?.focus();
          setFocusedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? filteredOptions.length - 1 : next;
          });
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[focusedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
        case "Tab":
          setOpen(false);
          break;
        case "Backspace":
          if (
            search === "" &&
            multiMode &&
            Array.isArray(value) &&
            value.length > 0
          ) {
            // 검색어가 없고 백스페이스를 누르면 마지막 선택 항목을 제거
            const lastItem = options.find(
              (opt) => opt.value === value[value.length - 1]
            );
            if (lastItem) {
              handleSelect(lastItem);
            }
          }
          break;
      }
    },
    [
      open,
      focusedIndex,
      filteredOptions,
      search,
      multiMode,
      value,
      options,
      handleSelect
    ]
  );

  const calculateDropdownPosition = useCallback(() => {
    if (!wrapperRef.current || !dropdownRef.current) return;

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    // 화면 아래쪽 공간이 부족한 경우 위쪽에 표시
    const spaceBelow = window.innerHeight - wrapperRect.bottom;
    const spaceAbove = wrapperRect.top;
    const showAbove =
      spaceBelow < dropdownRect.height && spaceAbove > spaceBelow;

    setDropdownPosition({
      top: showAbove
        ? wrapperRect.top - dropdownRect.height - 4 + scrollY
        : wrapperRect.bottom + 4 + scrollY,
      left: wrapperRect.left + scrollX
    });
  }, []);

  useLayoutEffect(() => {
    if (open) {
      calculateDropdownPosition();
    }
  }, [open, calculateDropdownPosition]);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      calculateDropdownPosition();
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, calculateDropdownPosition]);

  useLayoutEffect(() => {
    if (wrapperRef.current) {
      setDropdownWidth(wrapperRef.current.offsetWidth);
    }
  }, [open]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscClose);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [handleClickOutside, handleEscClose]);

  // 드롭다운이 처음 열릴 때만 선택된 옵션으로 스크롤
  useEffect(() => {
    if (open && selectedItems && !search) {
      // 검색 중이 아닐 때만
      const selectedIndex = filteredOptions.findIndex(
        (opt) => opt.value === (multiMode ? value[0] : value)
      );
      if (selectedIndex >= 0 && optionRefs.current[selectedIndex]) {
        optionRefs.current[selectedIndex].scrollIntoView({
          block: "center"
        });
        setFocusedIndex(selectedIndex);
      }
    }
  }, [open]); // open 상태가 변경될 때만 실행

  const handleClear = () => {
    onChange(multiMode ? [] : null);
    setSearch("");
    inputRef.current?.focus();
  };

  const { bgColor, txtColor, borColor } = computeColorStyles({
    border,
    fallback: error ? "error" : isFocused ? "focus" : "default",
    componentType: "input"
  });

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

  // 선택된 항목 수 표시
  const getSelectedCountText = () => {
    if (!multiMode || !showSelectedCount) return null;
    const selectedCount = Array.isArray(value) ? value.length : 0;
    if (selectedCount === 0) return null;
    return `${selectedCount}개 선택됨`;
  };

  return (
    <div
      ref={wrapperRef}
      className={mergeClassNames("sud-select", className)}
      style={{
        position: "relative",
        maxWidth: "100%",
        minWidth: 0,
        ...style
      }}
      {...rest}
    >
      {label && (
        <label
          htmlFor={id}
          className="sud-select__label"
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 500,
            color: disabled
              ? resolveColor("cool-gray-3", theme)
              : resolveColor("cool-gray-9", theme)
          }}
        >
          {label}
        </label>
      )}

      <div
        className={mergeClassNames(disabled ? "" : "sud-hover", className)}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel || label}
        aria-required={ariaRequired}
        aria-invalid={ariaInvalid || error}
        aria-describedby={`${id}-description ${
          ariaDescribedby || (error ? `${id}-error` : "")
        }`}
        aria-disabled={disabled}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          backgroundColor: disabled
            ? resolveColor("cool-gray-1", theme)
            : finalBgColor,
          color: disabled ? resolveColor("cool-gray-3", theme) : finalTxtColor,
          ...shapeStyle,
          width: "100%",
          padding: sizeStyles.padding,
          cursor: disabled ? "not-allowed" : "pointer",
          boxShadow,
          ...(underline
            ? {
                borderTop: "none",
                borderRight: "none",
                borderLeft: "none",
                borderBottom: finalBorStyle,
                borderRadius: 0
              }
            : { border: finalBorStyle })
        }}
        onClick={() => {
          if (!disabled && !readOnly) {
            setOpen(!open);
            inputRef.current?.focus();
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {afterIcon && <div className="sud-select__after-icon">{afterIcon}</div>}
        <div
          className="sud-select__input-wrapper"
          style={{
            display: "flex",
            gap: 4,
            flex: 1,
            alignItems: "center",
            minWidth: 0
          }}
        >
          {multiMode ? (
            <div
              className="sud-select__scroll-zone"
              style={{
                display: "flex",
                flexWrap: "nowrap",
                alignItems: "center",
                gap: 4,
                overflowX: "auto",
                flex: 1,
                minWidth: 0
              }}
            >
              {Array.isArray(selectedItems) &&
                selectedItems.map((item) => (
                  <Tag
                    key={item.value}
                    size={size}
                    closeable
                    onClose={() => handleSelect(item)}
                    colorType={tagColorType}
                    className="sud-select__tag"
                  >
                    {item.label}
                  </Tag>
                ))}

              <input
                ref={inputRef}
                className="sud-select__input"
                value={open ? search : ""}
                onChange={(e) => setSearch(e.target.value)}
                disabled={disabled}
                placeholder={
                  Array.isArray(value) && value.length === 0 ? placeholder : ""
                }
                aria-autocomplete="list"
                aria-controls={`${id}-listbox`}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: sizeStyles.fontSize,
                  color: finalTxtColor,
                  flexGrow: 1,
                  minWidth: 60,
                  cursor: disabled ? "not-allowed" : "text"
                }}
              />
            </div>
          ) : (
            <input
              ref={inputRef}
              className="sud-select__input"
              value={open ? search : selectedItems?.label || ""}
              onChange={(e) => setSearch(e.target.value)}
              disabled={disabled}
              readOnly={!searchable}
              placeholder={!selectedItems ? placeholder : ""}
              style={{
                margin: 0,
                flex: 1,
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                fontSize: sizeStyles.fontSize,
                color: finalTxtColor,
                height: sizeStyles.height,
                cursor: disabled
                  ? "not-allowed"
                  : searchable
                  ? "text"
                  : "default"
              }}
            />
          )}
        </div>

        <div
          className="sud-select__actions"
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            flexShrink: 0,
            marginLeft: 8
          }}
        >
          {showSelectedCount && multiMode && (
            <span
              className="sud-select__count"
              style={{
                fontSize: sizeStyles.fontSize,
                color: resolveColor("cool-gray-6", theme),
                whiteSpace: "nowrap"
              }}
            >
              {getSelectedCountText()}
            </span>
          )}
          {clearable &&
            !disabled &&
            ((multiMode && value?.length > 0) || (!multiMode && value)) && (
              <Close
                size={sizeStyles.fontSize}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="sud-select__clear"
                style={{ cursor: "pointer" }}
                aria-label="선택 초기화"
              />
            )}
          <div className="sud-select__before-icon">{beforeIcon}</div>
        </div>
      </div>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            id={`${id}-listbox`}
            className="sud-select__dropdown"
            role="listbox"
            aria-label={ariaLabel || label}
            aria-multiselectable={multiMode}
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownWidth || "100%",
              maxHeight: 200,
              overflowY: "auto",
              transform: "translateY(0)",
              transition: "opacity 0.2s ease",
              pointerEvents: "auto",
              borderRadius: 6,
              boxShadow: getShadowStyle("md", theme),
              color: finalTxtColor,
              zIndex: 1500,
              background: finalBgColor,
              ...dropdownStyle
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                className="sud-select__empty"
                role="option"
                aria-disabled="true"
                style={{
                  padding: 10,
                  fontSize: 13,
                  color: resolveColor("cool-gray-5", theme),
                  cursor: "default"
                }}
              >
                검색 결과가 없습니다
              </div>
            ) : (
              filteredOptions.map((item, index) => {
                const isSelected = multiMode
                  ? value?.includes(item.value)
                  : value === item.value;
                return (
                  <div
                    key={item.value}
                    ref={(el) => (optionRefs.current[index] = el)}
                    className={mergeClassNames(
                      "sud-select__option",
                      isSelected ? "sud-select__option--selected" : "",
                      index === focusedIndex
                        ? "sud-select__option--focused"
                        : ""
                    )}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(item);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: disabled ? "not-allowed" : "pointer",
                      fontSize: sizeStyles.fontSize,
                      backgroundColor: isSelected
                        ? resolveColor("sky-1", theme)
                        : finalBgColor,
                      transition: "background-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = resolveColor(
                          "cool-gray-2",
                          theme
                        );
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = finalBgColor;
                      }
                    }}
                  >
                    {item.label}
                  </div>
                );
              })
            )}
          </div>,
          document.body
        )}

      {error && errorText && (
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
            {errorText}
          </Typography>
        </div>
      )}
    </div>
  );
};
