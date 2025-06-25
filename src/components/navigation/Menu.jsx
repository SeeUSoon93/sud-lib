"use client";

import React, { useRef, useState, useEffect } from "react";
import { Accordion } from "../dataDisplay/Accordion";
import { PopupBase } from "./base/PopupBase";
import { AngleDown, AngleRight } from "sud-icons";
import { Divider } from "./Divider";
import {
  resolveColor,
  getShapeStyles,
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
  const [isHovered, setIsHovered] = useState(false);

  const triggerRef = useRef();
  const itemContentRef = useRef(null);

  const isSelected = selectedKey === item.key;
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const isActive = isSelected || isHovered;

  const fallback = isSelected ? "selected" : "hovered";
  const computed = computeColorStyles({
    border: false,
    componentType: "etc",
    fallback
  });

  const bgColor = isSelected
    ? styleProps.selectedColor || computed.bgColor
    : styleProps.hoverColor || computed.bgColor;
  const txtColor = isSelected
    ? styleProps.selectedTextColor || computed.txtColor
    : styleProps.hoverTextColor || computed.txtColor;

  useEffect(() => {
    const handleMove = (e) => {
      const el = e.target;
      const insideTrigger = triggerRef.current?.contains(el);
      const insideContent = itemContentRef.current?.contains(el); // 부모 팝업 참조(근데 최상위만 참조안함..)

      if (insideTrigger) {
        if (!isHovered) setIsHovered(true);
      } else {
        if (isHovered) setIsHovered(false);
      }
    };
    document.addEventListener("pointermove", handleMove);
    return () => document.removeEventListener("pointermove", handleMove);
  }, [isHovered]);

  const triggerNode = (
    <div
      ref={triggerRef}
      className={mergeClassNames("sud-menu__item", {
        "sud-menu__item--active": isActive
      })}
      style={{
        ...(isActive && {
          backgroundColor: bgColor,
          color: txtColor
        }),
        whiteSpace: "nowrap",
        padding: 12,
        borderRadius: 10,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8
      }}
      role="menuitem"
      aria-haspopup={hasChildren ? "true" : undefined}
      aria-expanded={hasChildren ? isHovered : undefined}
      onClick={() => {
        if (!hasChildren) {
          onSelect?.(item.key);
          item.onClick?.();
        }
      }}
    >
      <span>{item.label}</span>
      {hasChildren &&
        (level === 0 ? <AngleDown size={16} /> : <AngleRight size={16} />)}
    </div>
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
  const commonProps = {
    items,
    selectedKey,
    defaultSelectedKey,
    onSelect,
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

  const { borColor } = computeColorStyles({
    border,
    fallback: colorType
  });
  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : borColor;

  const { borColor: dividerBorColor } = computeColorStyles({
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
              selectedKey={selectedKey}
              onSelect={onSelect}
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
