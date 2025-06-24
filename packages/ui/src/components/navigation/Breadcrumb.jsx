"use client";

import { computeColorStyles, mergeClassNames } from "../../theme/themeUtils";
import { Typography } from "../general/Typography";

export const Breadcrumb = ({
  className,
  items = [],
  separator = ">",
  style = {},
  separatorStyle = {},
  linkStyle = {},
  itemStyle = {},
  listStyle = {},
  size = "base"
}) => {
  if (!items || items.length === 0) return null;

  const { separatorColor, textColor, nowColor } = computeColorStyles({
    componentType: "breadcrumb"
  });

  const resolvedSeparatorStyle = {
    color: separatorColor,
    ...separatorStyle
  };
  const resolvedTextStyle = {
    color: textColor
  };
  const resolvedNowStyle = {
    color: nowColor
  };

  const iconStyle = {
    height: "1em",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  };

  return (
    <nav
      className={mergeClassNames("sud-breadcrumb", className)}
      style={style}
      aria-label="Breadcrumb"
    >
      <ol
        className="sud-breadcrumb__list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          margin: 0,
          padding: 0,
          listStyle: "none",
          ...listStyle
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isIcon = typeof item.label !== "string";

          return (
            <li
              key={`${item.label}-${index}`}
              className="sud-breadcrumb__item"
              style={{
                display: "flex",
                alignItems: "center",
                ...itemStyle
              }}
            >
              {item.href && !isLast ? (
                <Typography
                  as="span"
                  className={mergeClassNames("sud-breadcrumb__link", className)}
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    cursor: "pointer",
                    ...resolvedTextStyle,
                    ...linkStyle
                  }}
                  onClick={() => {
                    window.location.href = item.href;
                  }}
                  pretendard="L"
                  size={size}
                >
                  {isIcon ? (
                    <span style={iconStyle}>{item.label}</span>
                  ) : (
                    item.label
                  )}
                </Typography>
              ) : (
                <Typography
                  as="div"
                  className="sud-breadcrumb__link-text"
                  style={resolvedNowStyle}
                  pretendard="SB"
                  size={size}
                >
                  {isIcon ? (
                    <span style={iconStyle}>{item.label}</span>
                  ) : (
                    item.label
                  )}
                </Typography>
              )}
              {!isLast && (
                <>
                  {typeof separator === "string" ? (
                    <Typography
                      as="span"
                      className="sud-breadcrumb__separator"
                      style={{
                        margin: "0 8px",
                        ...resolvedSeparatorStyle
                      }}
                      size={size}
                    >
                      {separator}
                    </Typography>
                  ) : (
                    <span style={iconStyle}>{separator}</span>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
