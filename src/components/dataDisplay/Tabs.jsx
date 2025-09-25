"use client";

import { useState, Children, isValidElement, useRef } from "react";
import {
  computeColorStyles,
  resolveColor,
  mergeClassNames
} from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";
import { Typography } from "../general/Typography";

export const Tabs = ({
  value: controlled,
  defaultValue,
  onChange,
  options,
  children,
  size = "md",
  colorType = { active: "default", inactive: "sub" },
  background = { active: undefined, inactive: undefined },
  color = { active: undefined, inactive: undefined },
  border = true,
  borderColor = { active: undefined, inactive: undefined },
  borderType = "solid",
  borderWeight = 1,
  style = {},
  className = "",
  disabledKeys = [],
  align = "left",
  ...rest
}) => {
  const theme = useTheme();
  const tabs = options
    ? options.map((opt) => ({
        key: opt.key,
        label: opt.label,
        content: opt.children || null
      }))
    : Children.toArray(children)
        .filter((child) => isValidElement(child) && child.type === TabPane)
        .map((child, index) => {
          const key = child.props.tabKey || `tab-${index}`;
          return {
            key,
            label: child.props.label,
            content: child.props.children
          };
        });
  const firstTabKey = tabs[0]?.key;
  const [internal, setInternal] = useState(defaultValue ?? firstTabKey);
  const activeKey = controlled ?? internal;
  const isControlled = controlled !== undefined;
  const tabsRef = useRef([]);

  const sizeMap = {
    xs: {
      padding: theme.spacing.xs,
      fontSize: theme.typography.fontSize.xs
    },
    sm: {
      padding: theme.spacing.sm,
      fontSize: theme.typography.fontSize.sm
    },
    md: {
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.base
    },
    lg: {
      padding: theme.spacing.lg,
      fontSize: theme.typography.fontSize.lg
    },
    xl: {
      padding: theme.spacing.xl,
      fontSize: theme.typography.fontSize["2xl"]
    },
    "2xl": {
      padding: theme.spacing["2xl"],
      fontSize: theme.typography.fontSize["3xl"]
    }
  };

  const handleChange = (key) => {
    if (!isControlled) setInternal(key);
    onChange?.(key);
    const targetTab = tabsRef.current[key];
    if (targetTab) {
      targetTab.focus();
    }
  };

  const handleKeyDown = (event, key) => {
    const currentIndex = tabs.findIndex((tab) => tab.key === key);

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % tabs.length;
        handleChange(tabs[nextIndex].key);
        break;
      case "ArrowLeft":
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        handleChange(tabs[prevIndex].key);
        break;
      case "Home":
        event.preventDefault();
        handleChange(tabs[0].key);
        break;
      case "End":
        event.preventDefault();
        handleChange(tabs[tabs.length - 1].key);
        break;
      default:
        break;
    }
  };

  const getColorStyles = (type) => {
    const {
      bgColor: activeBg,
      txtColor: activeTxtColor,
      borColor: activeBorColor
    } = computeColorStyles({
      border,
      fallback: colorType.active
    });

    const {
      bgColor: inactiveBg,
      txtColor: inactiveTxtColor,
      borColor: inactiveBorColor
    } = computeColorStyles({
      border,
      fallback: colorType.inactive
    });

    return {
      active: {
        bgColor: background.active
          ? resolveColor(background.active, theme)
          : activeBg,
        txtColor: color.active
          ? resolveColor(color.active, theme)
          : activeTxtColor,
        borColor: borderColor.active
          ? resolveColor(borderColor.active, theme)
          : activeBorColor,
        bottomBorderColor: borderColor.active
          ? resolveColor(borderColor.active, theme)
          : activeBorColor
      },
      inactive: {
        bgColor: background.inactive
          ? resolveColor(background.inactive, theme)
          : inactiveBg,
        txtColor: color.inactive
          ? resolveColor(color.inactive, theme)
          : inactiveTxtColor,
        borColor: borderColor.inactive
          ? resolveColor(borderColor.inactive, theme)
          : inactiveBorColor,
        bottomBorderColor: borderColor.inactive
          ? resolveColor(borderColor.inactive, theme)
          : inactiveBorColor
      }
    };
  };

  const {
    bgColor: disabledBg,
    txtColor: disabledTxtColor,
    borColor: disabledBorColor
  } = computeColorStyles({
    border,
    fallback: "disabled"
  });

  const { borColor: defaultBorColor } = computeColorStyles({
    border,
    fallback: "default"
  });

  const colorStyles = getColorStyles();

  const alignMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  };

  const activeTab = tabs.find((tab) => tab.key === activeKey);

  return (
    <div
      className={mergeClassNames("sud-tabs", className)}
      style={{ width: "100%", ...style }}
      role="tablist"
      {...rest}
    >
      <div
        className="sud-tabs__header"
        style={{
          display: "flex",
          gap: 2,
          borderBottom: `${borderWeight}px ${borderType} ${defaultBorColor}`,
          justifyContent: alignMap[align]
        }}
      >
        {tabs.map(({ key, label }) => {
          const selected = key === activeKey;
          const isDisabled = disabledKeys.includes(key);
          const currentStyle = selected
            ? colorStyles.active
            : colorStyles.inactive;

          return (
            <div
              key={key}
              ref={(el) => (tabsRef.current[key] = el)}
              onClick={() => !isDisabled && handleChange(key)}
              onKeyDown={(e) => !isDisabled && handleKeyDown(e, key)}
              tabIndex={selected && !isDisabled ? 0 : -1}
              role="tab"
              aria-selected={selected}
              aria-disabled={isDisabled}
              aria-controls={`tabpanel-${key}`}
              id={`tab-${key}`}
              style={{
                padding: `calc(${sizeMap[size].padding}/2) ${sizeMap[size].padding}`,
                background: isDisabled ? disabledBg : currentStyle.bgColor,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                cursor: isDisabled ? "not-allowed" : "pointer",
                color: isDisabled ? disabledTxtColor : currentStyle.txtColor,
                borderTop: `${borderWeight}px ${borderType} ${
                  isDisabled ? disabledBorColor : currentStyle.borColor
                }`,
                borderLeft: `${borderWeight}px ${borderType} ${
                  isDisabled ? disabledBorColor : currentStyle.borColor
                }`,
                borderRight: `${borderWeight}px ${borderType} ${
                  isDisabled ? disabledBorColor : currentStyle.borColor
                }`,
                borderBottom: "none",
                marginBottom: -1,
                transition: "all 0.2s ease-in-out",
                opacity: isDisabled ? 0.5 : 1
              }}
            >
              {typeof label === "string" ? (
                <Typography
                  as="span"
                  style={{ fontSize: sizeMap[size].fontSize }}
                  color={isDisabled ? disabledTxtColor : currentStyle.txtColor}
                  pretendard="SB"
                >
                  {label}
                </Typography>
              ) : (
                label
              )}
            </div>
          );
        })}
      </div>
      <div
        className="sud-tabs__content"
        role="tabpanel"
        id={`tabpanel-${activeKey}`}
        aria-labelledby={`tab-${activeKey}`}
        style={{
          borderTop: "none",
          padding: 16,
          background: "transparent",
          transition: "opacity 0.2s ease-in-out"
        }}
      >
        {activeTab?.content}
      </div>
    </div>
  );
};

export const TabPane = ({ children, label }) => children;
Tabs.TabPane = TabPane;
Tabs.displayName = "Tabs";
TabPane.displayName = "Tabs.TabPane";
