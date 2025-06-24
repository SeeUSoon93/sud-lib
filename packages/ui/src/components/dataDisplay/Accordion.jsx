"use client";

import React, { useState, useRef, useEffect } from "react";
import { AngleDown } from "sud-icons";
import {
  resolveColor,
  mergeClassNames,
  computeColorStyles,
  getShapeStyles,
  getShadowStyle
} from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";
import { Typography } from "../general/Typography";
import { Divider } from "../navigation/Divider";

// 서브 메뉴
const SubMenuWrapper = ({ isOpen, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isOpen) {
      el.style.display = "block";
      const height = el.scrollHeight;
      el.style.height = "0px";
      requestAnimationFrame(() => {
        el.style.transition = "height 0.3s ease";
        el.style.height = `${height}px`;
      });
      const timeout = setTimeout(() => {
        el.style.height = "auto";
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      const height = el.scrollHeight;
      el.style.height = `${height}px`;
      requestAnimationFrame(() => {
        el.style.transition = "height 0.3s ease";
        el.style.height = "0px";
      });
      const timeout = setTimeout(() => {
        el.style.display = "none";
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <ul
      ref={ref}
      style={{
        overflow: "hidden",
        height: 0,
        margin: "8px 0 0 0",
        padding: 0,
        listStyle: "none",
        display: "none"
      }}
    >
      {children}
    </ul>
  );
};

// 메뉴 아이템
const MenuItem = ({
  item,
  level = 0,
  selectedKey,
  onSelect,
  toggleOpen,
  openKeys,
  getItemStyle,
  theme,
  divider,
  finalDividerColor,
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const isOpen = openKeys.includes(item.key);
  const isLeaf = !hasChildren;
  const paddingLeft = `${12 + level * 16}px`;

  const { backgroundColor, color } = getItemStyle(item.key, isLeaf, hovered);

  if (item.mode === "group") {
    return (
      <li className="mg-b-6" key={`group-${item.title}`}>
        {typeof item.title === "string" ? (
          <Typography
            className="sud-accordion__group-title"
            as="div"
            size="sm"
            pretendard="B"
            color="cool-gray-6"
            style={{ padding: "4px 12px", paddingLeft }}
          >
            {item.title}
          </Typography>
        ) : (
          <div style={{ padding: "4px 12px", paddingLeft }}>{item.title}</div>
        )}
        <ul
          className="sud-accordion__sub-wrapper"
          style={{ listStyle: "none", margin: 0, padding: 0 }}
        >
          {item.children.map((child, index) => (
            <React.Fragment
              key={child.key || `${item.title}-group-child-${index}`}
            >
              <MenuItem
                key={child.key || `${item.title}-group-child-${index}`}
                item={child}
                level={level + 1}
                selectedKey={selectedKey}
                onSelect={onSelect}
                toggleOpen={toggleOpen}
                openKeys={openKeys}
                getItemStyle={getItemStyle}
                theme={theme}
                divider={divider}
                finalDividerColor={finalDividerColor}
              />
              {divider && index < item.children.length - 1 && (
                <Divider
                  borderColor={finalDividerColor}
                  style={{ margin: "0.5rem 0" }}
                />
              )}
            </React.Fragment>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="sud-accordion__item mg-b-6 ">
      <div
        className="sud-accordion__item-inner rad-10 cursor-pointer pd-12 flex jus-bet item-cen"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          paddingLeft,
          backgroundColor,
          color,
          transition: "all 0.2s ease"
        }}
        onClick={() => {
          if (isLeaf) {
            onSelect?.(item.key);
            item.onClick?.();
          } else {
            toggleOpen(item.key);
          }
        }}
        role={hasChildren ? "button" : "menuitem"}
        aria-expanded={hasChildren ? isOpen : undefined}
        aria-haspopup={hasChildren ? "true" : undefined}
        aria-controls={
          hasChildren ? `accordion-content-${item.key}` : undefined
        }
        aria-label={item.label}
        {...rest}
      >
        <div className="sud-accordion__item-content flex item-cen gap-8">
          {item.icon && <span>{React.cloneElement(item.icon, { color })}</span>}
          {typeof item.label === "string" ? (
            <Typography
              as="span"
              className="sud-accordion__item-label"
              color={color}
              style={{ whiteSpace: "nowrap" }}
            >
              {item.label}
            </Typography>
          ) : (
            item.label
          )}
        </div>
        {hasChildren && (
          <span className="sud-accordion__item-arrow">
            <AngleDown
              size="15"
              style={{
                transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
                transformOrigin: "center",
                transition: "transform 0.3s ease-in",
                color
              }}
            />
          </span>
        )}
      </div>

      {hasChildren && (
        <SubMenuWrapper isOpen={isOpen}>
          <div
            id={`accordion-content-${item.key}`}
            role="region"
            aria-labelledby={`accordion-header-${item.key}`}
          >
            {item.children.map((child, index) => (
              <React.Fragment key={child.key || `${item.key}-sub-${index}`}>
                <MenuItem
                  item={child}
                  level={level + 1}
                  selectedKey={selectedKey}
                  onSelect={onSelect}
                  toggleOpen={toggleOpen}
                  openKeys={openKeys}
                  getItemStyle={getItemStyle}
                  theme={theme}
                  divider={divider}
                  finalDividerColor={finalDividerColor}
                />
                {divider && index < item.children.length - 1 && (
                  <Divider
                    borderColor={finalDividerColor}
                    style={{ margin: "0.5rem 0" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </SubMenuWrapper>
      )}
    </li>
  );
};

export const Accordion = ({
  items = [],
  selectedKey: propSelectedKey,
  defaultSelectedKey,
  onSelect,
  selectedColor,
  selectedTextColor,
  hoverColor,
  hoverTextColor,
  className,
  divider = true,
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
  style = {}
}) => {
  const theme = useTheme();
  const shapeStyle = getShapeStyles(shape, theme);
  const boxShadow = getShadowStyle(shadow, theme);
  const [internalSelected, setInternalSelected] = useState(
    defaultSelectedKey || ""
  );
  const [openKeys, setOpenKeys] = useState([]);

  const selectedKey = propSelectedKey || internalSelected;

  const handleSelect = (key) => {
    if (propSelectedKey === undefined) {
      setInternalSelected(key);
    }
    onSelect?.(key);
  };

  const toggleOpen = (key) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const getItemStyle = (key, isLeaf, isHovered) => {
    const isSelected = selectedKey === key && isLeaf;
    const fallback = isSelected
      ? "selected"
      : isHovered
      ? "hovered"
      : "default";

    const computed = computeColorStyles({
      border: false,
      componentType: "etc",
      fallback
    });

    return {
      backgroundColor:
        (isSelected && selectedColor && resolveColor(selectedColor, theme)) ||
        (isHovered && hoverColor && resolveColor(hoverColor, theme)) ||
        computed.bgColor,
      color:
        (isSelected &&
          selectedTextColor &&
          resolveColor(selectedTextColor, theme)) ||
        (isHovered && hoverTextColor && resolveColor(hoverTextColor, theme)) ||
        computed.txtColor
    };
  };

  const { bgColor, txtColor, borColor } = computeColorStyles({
    border,
    fallback: colorType
  });

  const { borColor: dividerBorColor } = computeColorStyles({
    border: divider,
    fallback: colorType
  });

  const finalBgColor = background ? resolveColor(background, theme) : bgColor;

  const finalTxtColor = color ? resolveColor(color, theme) : txtColor;

  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : borColor;

  const finalDividerColor = dividerColor
    ? resolveColor(dividerColor, theme)
    : dividerBorColor;

  const finalBorStyle =
    border && finalBorColor
      ? `${borderWeight}px ${borderType} ${finalBorColor}`
      : "none";

  return (
    <div
      className={mergeClassNames("sud-accordion", className)}
      style={{
        backgroundColor: finalBgColor,
        color: finalTxtColor,
        border: finalBorStyle,
        boxShadow: boxShadow,
        ...shapeStyle,
        ...style
      }}
    >
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((item, index) => (
          <React.Fragment key={item.key || `menu-item-${index}`}>
            <MenuItem
              item={item}
              selectedKey={selectedKey}
              onSelect={handleSelect}
              toggleOpen={toggleOpen}
              openKeys={openKeys}
              getItemStyle={getItemStyle}
              theme={theme}
              divider={divider}
              finalDividerColor={finalDividerColor}
            />
            {divider && index < items.length - 1 && (
              <Divider
                borderColor={finalDividerColor}
                style={{ margin: "0.5rem 0" }}
              />
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};
