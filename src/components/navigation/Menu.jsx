"use client";

import React, { useRef, useState } from "react";
import { Accordion } from "../dataDisplay/Accordion";
import { PopupBase } from "./base/PopupBase";
import { AngleDown, AngleRight } from "sud-icons";
import { Divider } from "./Divider";
import {
  resolveColor,
  computeColorStyles,
  mergeClassNames
} from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";

const PopoverItem = ({
  item,
  level,
  parentRef,
  selectedKey,
  onSelect,
  styleProps,
  popupBaseStyleProps,
  placement,
  colorType
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const triggerRef = useRef();
  const itemContentRef = useRef(null);

  const isSelected = selectedKey === item.key;
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const isActive = isSelected || isHovered;

  const fallback = isSelected ? "selected" : "hovered";
  const computed = computeColorStyles({
    theme,
    border: false,
    componentType: "etc",
    fallback
  });

  // Accordion 모드와 같이 "red-8" 같은 테마 토큰도 받는다.
  const resolveProp = (value) => (value ? resolveColor(value, theme) : undefined);
  const bgColor = isSelected
    ? resolveProp(styleProps.selectedColor) || computed.bgColor
    : resolveProp(styleProps.hoverColor) || computed.bgColor;
  const txtColor = isSelected
    ? resolveProp(styleProps.selectedTextColor) || computed.txtColor
    : resolveProp(styleProps.hoverTextColor) || computed.txtColor;

  const activate = () => {
    if (!hasChildren) {
      onSelect?.(item.key);
      item.onClick?.();
    }
  };

  const triggerNode = (
    <button
      type="button"
      ref={triggerRef}
      className={mergeClassNames(
        "sud-menu__item",
        isActive && "sud-menu__item--active"
      )}
      style={{
        ...(isActive && {
          backgroundColor: bgColor,
          color: txtColor
        }),
        whiteSpace: "nowrap",
        padding: 12,
        borderRadius: 10,
        cursor: "pointer",
        border: 0,
        font: "inherit",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8
      }}
      role="menuitem"
      aria-haspopup={hasChildren ? "true" : undefined}
      aria-expanded={hasChildren ? isHovered : undefined}
      onClick={activate}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onKeyDown={(event) => {
        if (!hasChildren && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          activate();
        }
      }}
    >
      <span>{item.label}</span>
      {hasChildren &&
        (level === 0 ? <AngleDown size={16} /> : <AngleRight size={16} />)}
    </button>
  );

  if (!hasChildren) return triggerNode;

  return (
    <div className="sud-menu__popup-wrapper" style={{ position: "relative" }}>
      <PopupBase
        key={item.key}
        trigger="hover"
        placement={placement[Math.min(level, placement.length - 1)]}
        closeOnClick={false}
        contentRef={itemContentRef}
        parentRef={parentRef}
        colorType={colorType}
        content={
          <Menu
            items={item.children}
            expandType="popover"
            selectedKey={selectedKey}
            onSelect={onSelect}
            parentContentRef={itemContentRef}
            level={level + 1}
            colorType={colorType}
            {...styleProps}
            {...popupBaseStyleProps}
          />
        }
        {...popupBaseStyleProps}
      >
        {triggerNode}
      </PopupBase>
    </div>
  );
};

export const Menu = ({
  // 공통 동작 관련
  items = [],
  selectedKey,
  defaultSelectedKey,
  onSelect,

  // Accordion, PopupBase 공통 스타일 관련
  selectedColor,
  selectedTextColor,
  hoverColor,
  hoverTextColor,
  className,
  divider = false,
  colorType = "default",
  dividerColor,
  level = 0,
  // PopupBase용 추가 스타일 props
  background,
  color,
  border = false,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  shape = "rounded",
  shadow = "none",
  placement = ["bottom", "right"],
  horizontal = false,
  // 메뉴 확장 타입
  expandType = "accordion",
  style = {},
  // 부모 팝업 참조
  parentContentRef = null,
  ...rest
}) => {
  const theme = useTheme();
  const [internalSelectedKey, setInternalSelectedKey] = useState(defaultSelectedKey);
  const effectiveSelectedKey = selectedKey ?? internalSelectedKey;
  const handleSelect = (key) => {
    if (selectedKey === undefined) setInternalSelectedKey(key);
    onSelect?.(key);
  };
  const commonProps = {
    items,
    selectedKey: effectiveSelectedKey,
    defaultSelectedKey,
    onSelect: handleSelect,
    selectedColor,
    selectedTextColor,
    hoverColor,
    hoverTextColor,
    className,
    divider,
    colorType,
    dividerColor,
    background,
    color,
    border,
    borderColor,
    borderType,
    borderWeight,
    shape,
    shadow,
    style
  };

  const popupBaseStyleProps = {
    background,
    color,
    border,
    borderColor,
    borderType,
    borderWeight,
    shape,
    shadow
  };
  // styleProps 변수 정의
  const styleProps = {
    selectedColor,
    selectedTextColor,
    hoverColor,
    hoverTextColor
  };
  if (expandType === "accordion") {
    return <Accordion {...commonProps} />;
  }

  const { borColor: dividerBorColor } = computeColorStyles({
    theme,
    border: divider,
    fallback: colorType
  });
  const finalDividerBorColor = dividerColor
    ? resolveColor(dividerColor, theme)
    : dividerBorColor;

  if (expandType === "popover") {
    return (
      <div
        className={mergeClassNames("sud-menu", className)}
        style={{
          display: horizontal ? "flex" : "block",
          gap: horizontal ? 8 : undefined,
          ...style
        }}
        role="menu"
        aria-orientation={horizontal ? "horizontal" : "vertical"}
        {...rest}
      >
        {items.map((item, index) => (
          <React.Fragment key={item.key || `menu-item-${index}`}>
            <PopoverItem
              item={item}
              level={level}
              parentRef={parentContentRef}
              selectedKey={effectiveSelectedKey}
              onSelect={handleSelect}
              styleProps={styleProps}
              popupBaseStyleProps={popupBaseStyleProps}
              placement={placement}
              colorType={colorType}
            />
            {divider &&
              index < items.length - 1 &&
              (horizontal ? (
                <div
                  style={{
                    width: 1,
                    height: 20,
                    backgroundColor: finalDividerBorColor,
                    margin: "auto 0"
                  }}
                />
              ) : (
                <Divider
                  borderColor={finalDividerBorColor}
                  style={{ margin: "1rem 0" }}
                />
              ))}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return null;
};
