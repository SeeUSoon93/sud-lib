"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { mergeClassNames } from "../../theme/themeUtils";
import { Pagination } from "../navigation/Pagination";
import { Divider } from "../navigation/Divider";
import { DotSpinner } from "../feedback/DotSpinner";
import { Empty } from "../feedback/Empty";

export const List = ({
  dataSource = [],
  pagination = false,
  gap = 8,
  split = true,
  loading = false,
  emptyText = "No Data",
  className,
  style = {},
  itemStyle = {},
  listStyle = {},
  virtualScroll = false,
  itemHeight = 40,
  overscanCount = 5,
  ...rest
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const itemRefs = useRef(new Map());

  // 컨테이너 높이 측정
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerHeight(entry.contentRect.height);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // 아이템 높이 측정
  const measureItemHeight = useCallback((index, element) => {
    if (element) {
      itemRefs.current.set(index, element.getBoundingClientRect().height);
    }
  }, []);

  // 데이터 소스가 변경될 때만 계산
  const hasData = useMemo(
    () => Array.isArray(dataSource) && dataSource.length > 0,
    [dataSource]
  );

  // 가상 스크롤링 관련 계산
  const { visibleItems, startIndex, endIndex, totalHeight } = useMemo(() => {
    if (!virtualScroll || !containerHeight) {
      return {
        visibleItems: dataSource,
        startIndex: 0,
        endIndex: dataSource.length,
        totalHeight: 0
      };
    }

    let currentHeight = 0;
    let startIndex = 0;
    let endIndex = 0;
    let foundStart = false;

    // 아이템 높이를 기반으로 시작/끝 인덱스 계산
    for (let i = 0; i < dataSource.length; i++) {
      const itemHeight = itemRefs.current.get(i) || itemHeight || 40;
      if (!foundStart && currentHeight + itemHeight > scrollTop) {
        startIndex = Math.max(0, i - overscanCount);
        foundStart = true;
      }
      if (foundStart && currentHeight > scrollTop + containerHeight) {
        endIndex = Math.min(dataSource.length, i + overscanCount);
        break;
      }
      currentHeight += itemHeight;
    }

    if (!foundStart) {
      startIndex = 0;
    }
    if (endIndex === 0) {
      endIndex = dataSource.length;
    }

    return {
      visibleItems: dataSource.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalHeight: currentHeight
    };
  }, [
    virtualScroll,
    containerHeight,
    scrollTop,
    dataSource,
    itemHeight,
    overscanCount
  ]);

  // 페이지네이션 관련 계산 메모이제이션
  const { pageSize, paginatedData } = useMemo(() => {
    const size = pagination?.pageSize || dataSource.length;
    const data = pagination
      ? dataSource.slice((currentPage - 1) * size, currentPage * size)
      : dataSource;
    return { pageSize: size, paginatedData: data };
  }, [dataSource, pagination, currentPage]);

  // 스크롤 핸들러
  const handleScroll = useCallback(
    (e) => {
      if (virtualScroll) {
        setScrollTop(e.target.scrollTop);
      }
    },
    [virtualScroll]
  );

  // 정렬 스타일 계산 메모이제이션
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

  // 페이지 변경 핸들러 메모이제이션
  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      if (typeof pagination === "object" && pagination.onChange) {
        pagination.onChange(page);
      }
    },
    [pagination]
  );

  // 아이템 렌더링 메모이제이션
  const renderItems = useCallback(() => {
    const itemsToRender = virtualScroll ? visibleItems : paginatedData;

    return itemsToRender.map((item, index) => {
      const actualIndex = virtualScroll ? startIndex + index : index;
      return (
        <div
          key={actualIndex}
          ref={(el) => measureItemHeight(actualIndex, el)}
          style={{
            ...(virtualScroll && {
              position: "absolute",
              width: "100%",
              top: (() => {
                let offset = 0;
                for (let i = 0; i < actualIndex; i++) {
                  offset += itemRefs.current.get(i) || itemHeight || 40;
                }
                return offset;
              })()
            })
          }}
        >
          <div
            style={{
              marginBottom: gap,
              width: "100%",
              ...itemStyle
            }}
            className="sud-list__item"
          >
            {typeof item === "string" ? item : item}
          </div>
          {split && index !== itemsToRender.length - 1 && <Divider />}
        </div>
      );
    });
  }, [
    virtualScroll,
    visibleItems,
    paginatedData,
    startIndex,
    gap,
    itemStyle,
    split,
    itemHeight,
    measureItemHeight
  ]);

  return (
    <div
      className={mergeClassNames("sud-list", className)}
      style={{
        minHeight: "100px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        ...style
      }}
      role="list"
      aria-label="데이터 목록"
      {...rest}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 0"
          }}
          role="status"
          aria-label="데이터 로딩 중"
        >
          <DotSpinner />
        </div>
      ) : hasData ? (
        <>
          <div
            ref={containerRef}
            className="sud-list__content"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              position: "relative",
              height: virtualScroll ? "100%" : "auto",
              minHeight: virtualScroll ? "100px" : "auto",
              overflow: virtualScroll ? "auto" : "visible",
              flex: 1,
              ...listStyle
            }}
            role="list"
            aria-label="리스트 레이아웃"
            onScroll={handleScroll}
          >
            {virtualScroll && (
              <div
                style={{
                  height: totalHeight,
                  position: "relative",
                  width: "100%"
                }}
              />
            )}
            <div
              style={{
                position: virtualScroll ? "absolute" : "relative",
                top: 0,
                left: 0,
                right: 0,
                width: "100%",
                ...(virtualScroll && {
                  minWidth: "100%"
                })
              }}
            >
              {renderItems()}
            </div>
          </div>
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
                total={dataSource.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                {...(typeof pagination === "object" ? pagination : {})}
              />
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: "40px 0" }}>
          <Empty description={emptyText} />
        </div>
      )}
    </div>
  );
};
