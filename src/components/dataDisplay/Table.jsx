"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback
} from "react";
import { useTheme } from "../../theme/ThemeContext";
import {
  computeColorStyles,
  resolveColor,
  getShapeStyles,
  getShadowStyle,
  mergeClassNames
} from "../../theme/themeUtils";
import { Typography } from "../general/Typography";
import { TriangleUp, TriangleDown } from "sud-icons";
import { Pagination } from "../navigation/Pagination";
import { Empty } from "../feedback/Empty";

export const Table = ({
  columns = [],
  dataSource = [],
  rowKey = "key",
  size = "md",
  colorType = "sub",
  shape = "rounded",
  shadow = "none",
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  width = "100%",
  height = "auto",
  style = {},
  pagination = false,
  onChange,
  emptyText = "데이터가 없습니다",
  ...rest
}) => {
  if (columns.length === 0 || dataSource.length === 0) {
    return <Empty description={emptyText} />;
  }

  const theme = useTheme();
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    pagination && pagination.current ? pagination.current : 1
  );

  const pageSize =
    pagination && pagination !== false
      ? pagination.pageSize || 10
      : dataSource.length;
  const totalItems =
    pagination && pagination !== false
      ? pagination.total || dataSource.length
      : dataSource.length;

  const {
    bgColor,
    txtColor,
    borColor: defaultBorColor
  } = computeColorStyles({
    fallback: colorType,
    componentType: "button",
    border
  });

  const finalBorderColor = borderColor
    ? resolveColor(borderColor, theme)
    : defaultBorColor;
  const finalBorder = border
    ? `${borderWeight}px ${borderType} ${finalBorderColor}`
    : "none";

  const sizeStyleMap = useMemo(
    () => ({
      sm: { padding: "8px 12px", fontSize: 12 },
      md: { padding: "12px 16px", fontSize: 14 },
      lg: { padding: "16px 20px", fontSize: 16 }
    }),
    []
  );

  const sizeStyle = sizeStyleMap[size] || sizeStyleMap.md;
  const shapeStyle = getShapeStyles(shape, theme);
  const boxShadow = getShadowStyle(shadow, theme);
  const finalPadding = sizeStyle.padding;

  const getRowKey = useCallback(
    (item, index) =>
      typeof rowKey === "function" ? rowKey(item) : item[rowKey] ?? index,
    [rowKey]
  );

  const sortedData = useMemo(() => {
    if (!sortConfig) return dataSource;
    const { columnKey, order } = sortConfig;
    const col = columns.find((c) => (c.dataIndex || c.key) === columnKey);
    if (!col) return dataSource;
    const sorterFn =
      col.sorter === true
        ? (a, b) => {
            const valA = a[columnKey];
            const valB = b[columnKey];
            return typeof valA === "number"
              ? valA - valB
              : String(valA).localeCompare(String(valB));
          }
        : col.sorter;
    const sorted = [...dataSource].sort((a, b) => {
      const result = sorterFn(a, b);
      return order === "ascend" ? result : -result;
    });
    return sorted;
  }, [dataSource, sortConfig, columns]);

  const paginatedData = useMemo(() => {
    if (!pagination || pagination === false) {
      return sortedData;
    }
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize, pagination]);

  const handleSort = useCallback(
    (col) => {
      if (!col.sorter) return;
      const columnKey = col.key;
      let order = null;
      if (!sortConfig || sortConfig.columnKey !== columnKey) {
        order = "ascend";
      } else if (sortConfig.order === "ascend") {
        order = "descend";
      } else if (sortConfig.order === "descend") {
        order = null;
      }
      const newConfig = order ? { columnKey, order } : null;
      setSortConfig(newConfig);
      if (onChange) onChange({}, {}, newConfig);
    },
    [sortConfig, onChange]
  );

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      if (typeof pagination === "object" && pagination.onChange) {
        pagination.onChange(page);
      }
    },
    [pagination]
  );

  const getPaginationAlignStyle = useCallback((position) => {
    const alignMap = {
      left: "flex-start",
      center: "center",
      right: "flex-end"
    };
    if (position.includes("left")) return alignMap.left;
    if (position.includes("center")) return alignMap.center;
    if (position.includes("right")) return alignMap.right;
    return alignMap.center;
  }, []);

  const headerWrapperRef = useRef(null);
  const bodyWrapperRef = useRef(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const header = headerWrapperRef.current;
    const body = bodyWrapperRef.current;
    if (body && header) {
      const hasVerticalScroll = body.scrollHeight > body.clientHeight;
      const scrollbarSize = hasVerticalScroll
        ? body.offsetWidth - body.clientWidth
        : 0;
      setScrollbarWidth(scrollbarSize);
    }
  }, [sortedData, height]);

  const headerRadius = useMemo(
    () => ({
      borderTopLeftRadius: shapeStyle.borderRadius,
      borderTopRightRadius: shapeStyle.borderRadius
    }),
    [shapeStyle.borderRadius]
  );

  const bodyRadius = useMemo(
    () => ({
      borderBottomLeftRadius: shapeStyle.borderRadius,
      borderBottomRightRadius: shapeStyle.borderRadius
    }),
    [shapeStyle.borderRadius]
  );

  const computedColumns = useMemo(() => {
    const totalCol = columns.reduce((sum, col) => {
      return sum + (col.col || (col.width ? 0 : 1));
    }, 0);

    return columns.map((col) => {
      let widthStr = "auto";

      if (col.width) {
        if (typeof col.width === "number") {
          widthStr = `${col.width}px`;
        } else if (typeof col.width === "string") {
          widthStr = /^\d+$/.test(col.width) ? `${col.width}px` : col.width;
        }
      } else if (totalCol > 0) {
        const unit = col.col || 1;
        const percent = (unit / totalCol) * 100;
        widthStr = `${percent}%`;
      }

      return {
        ...col,
        width: widthStr
      };
    });
  }, [columns]);

  const handleKeyDown = useCallback(
    (e, col) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSort(col);
      }
    },
    [handleSort]
  );

  return (
    <div
      style={{ width, boxShadow, ...style }}
      className={mergeClassNames("sud-table", className)}
      role="table"
      aria-label="데이터 테이블"
      aria-rowcount={totalItems}
      {...rest}
    >
      {/* Header Table */}
      <div
        ref={headerWrapperRef}
        className={mergeClassNames("sud-table__header", headerClassName)}
        style={{
          overflow: "hidden",
          paddingRight: `${scrollbarWidth}px`,
          background: bgColor,
          ...headerRadius
        }}
      >
        <table
          style={{
            width: "100%",
            tableLayout: "fixed",
            borderCollapse: "collapse"
          }}
          role="presentation"
        >
          <colgroup>
            {computedColumns.map((col, idx) => (
              <col
                key={idx}
                style={{
                  width: typeof col.width === "string" ? col.width : "auto"
                }}
              />
            ))}
          </colgroup>
          <thead>
            <tr>
              {computedColumns.map((col, colIdx) => {
                const columnKey = col.key;
                const isSorted = sortConfig?.columnKey === columnKey;
                const order = isSorted ? sortConfig.order : null;
                const align = col.align || "left";

                return (
                  <th
                    key={columnKey || colIdx}
                    onClick={() => handleSort(col)}
                    className={mergeClassNames(
                      "sud-table__header-cell",
                      col.sorter && "sud-table__header-cell--sortable",
                      isSorted && `sud-table__header-cell--sorted-${order}`,
                      col.className
                    )}
                    style={{
                      textAlign: align,
                      background: bgColor,
                      color: txtColor,
                      borderBottom: finalBorder,
                      borderLeft: colIdx === 0 ? "none" : finalBorder,
                      borderRight:
                        colIdx === columns.length - 1 ? "none" : finalBorder,
                      fontSize: sizeStyle.fontSize,
                      padding: finalPadding,
                      cursor: col.sorter ? "pointer" : "default"
                    }}
                    role="columnheader"
                    aria-sort={
                      isSorted
                        ? order === "ascend"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    tabIndex={col.sorter ? 0 : -1}
                    onKeyDown={(e) => handleKeyDown(e, col)}
                    aria-label={`${col.title} ${
                      isSorted
                        ? order === "ascend"
                          ? "오름차순 정렬됨"
                          : "내림차순 정렬됨"
                        : ""
                    }`}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        justifyContent:
                          align === "center"
                            ? "center"
                            : align === "right"
                            ? "flex-end"
                            : "flex-start"
                      }}
                    >
                      <Typography
                        as="span"
                        pretendard="SB"
                        size={sizeStyle.fontSize}
                      >
                        {col.title}
                      </Typography>
                      {col.sorter && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            lineHeight: 0
                          }}
                          aria-hidden="true"
                        >
                          <TriangleUp
                            size={10}
                            style={{ opacity: order === "ascend" ? 1 : 0.3 }}
                          />
                          <TriangleDown
                            size={10}
                            style={{ opacity: order === "descend" ? 1 : 0.3 }}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
        </table>
      </div>

      {/* Body Table */}
      <div
        ref={bodyWrapperRef}
        className={mergeClassNames("sud-table__body", bodyClassName)}
        style={{ maxHeight: height, overflow: "auto", ...bodyRadius }}
        role="presentation"
        tabIndex={0}
        aria-label="테이블 본문"
      >
        {paginatedData.length === 0 ? (
          <div
            className="sud-table__empty"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
              background: bgColor,
              ...bodyRadius
            }}
            role="alert"
            aria-live="polite"
          >
            <Empty description={emptyText} />
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse"
            }}
            role="presentation"
          >
            <colgroup>
              {computedColumns.map((col, idx) => (
                <col
                  key={idx}
                  style={{
                    width: typeof col.width === "string" ? col.width : "auto"
                  }}
                />
              ))}
            </colgroup>
            <tbody>
              {paginatedData.map((item, rowIndex) => {
                const key = getRowKey(item, rowIndex);
                const rowBg =
                  resolveColor(item.background, theme) || "transparent";
                const rowColor = resolveColor(item.color, theme) || "inherit";
                const rowBorColor =
                  resolveColor(item.borderColor, theme) || finalBorderColor;
                const rowBorder = border
                  ? `${borderWeight}px ${borderType} ${rowBorColor}`
                  : "none";

                return (
                  <tr
                    key={key}
                    className={mergeClassNames(
                      "sud-table__row",
                      item.className
                    )}
                    role="row"
                    aria-rowindex={rowIndex + 1}
                    aria-selected={item.selected || false}
                  >
                    {computedColumns.map((col, colIdx) => {
                      const columnKey = col.key;
                      const value = item[columnKey];
                      const align = col.align || "left";

                      const content = col.render ? (
                        col.render(value, item, rowIndex)
                      ) : (
                        <Typography size={sizeStyle.fontSize}>
                          {value}
                        </Typography>
                      );

                      return (
                        <td
                          key={columnKey || colIdx}
                          className={mergeClassNames(
                            "sud-table__cell",
                            col.className
                          )}
                          style={{
                            textAlign: align,
                            background: rowBg,
                            color: rowColor,
                            borderBottom: rowBorder,
                            borderLeft: colIdx === 0 ? "none" : rowBorder,
                            borderRight:
                              colIdx === columns.length - 1
                                ? "none"
                                : rowBorder,
                            fontSize: sizeStyle.fontSize,
                            padding: finalPadding
                          }}
                          role="cell"
                          aria-label={`${col.title}: ${value}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && paginatedData.length > 0 && (
        <div
          style={{
            display: "flex",
            marginTop: "16px"
          }}
          role="navigation"
          aria-label="페이지네이션"
        >
          <Pagination
            defaultCurrent={currentPage}
            total={totalItems}
            pageSize={pageSize}
            onChange={handlePageChange}
            {...(typeof pagination === "object" ? pagination : {})}
          />
        </div>
      )}
    </div>
  );
};
