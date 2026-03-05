"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Button } from "../general/Button";
import { AngleLeft, AngleRight } from "sud-icons";
import { mergeClassNames } from "../../theme/themeUtils";

export const Carousel = ({
  items = [],
  itemWidthRatio = 0.8,
  itemCount = 1,
  itemGap = 0,
  autoPlay = false,
  autoPlayInterval = 3000,
  scaleRatio = 0.2,
  opacityRatio = 0.1,
  width,
  height,
  className,
  style,
  navBtn = true,
  leftBtnIcon = <AngleLeft size={30} />,
  rightBtnIcon = <AngleRight size={30} />,
  effectType = "fade", // "overlap" | "fade" | "slide" | "scale" | "stack"
  drag = true,
  onChange,
  currentIndex, // 제어 모드면 넘기기
  ...rest
}) => {
  const isControlled = currentIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState(currentIndex ?? 0);

  // 외부 인덱스 동기화 (제어 모드)
  useEffect(() => {
    if (isControlled && currentIndex !== internalIndex) {
      setInternalIndex(currentIndex);
    }
  }, [isControlled, currentIndex, internalIndex]);

  // 인덱스 변경은 여기로만 (onChange 단일 호출 지점)
  const setCurrentIndex = (idx) => {
    if (!isControlled) setInternalIndex(idx);
    if (onChange) onChange(idx);
  };

  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
    maxItemHeight: 300
  });

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  const itemRefs = useRef([]);

  // 아이템 최대 높이 계산 (Infinity 방지)
  useLayoutEffect(() => {
    const heights = (itemRefs.current || []).map((el) => el?.offsetHeight || 0);
    const maxHeight = heights.length ? Math.max(...heights) : 300;
    setContainerSize((prev) =>
      prev.maxItemHeight === maxHeight
        ? prev
        : { ...prev, maxItemHeight: maxHeight }
    );
  }, [items, internalIndex]);

  // 컨테이너 리사이즈 감지
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize((prev) => {
        if (prev.width === width && prev.height === height) return prev;
        return { ...prev, width, height };
      });
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const total = items.length || 1;
  const clamped = Math.min(itemCount, total);
  const isMulti = clamped > 1;
  const effectiveItemWidth = isMulti
    ? (containerSize.width - itemGap * (clamped - 1)) / clamped
    : containerSize.width * itemWidthRatio;

  const handlePrev = () => {
    if (!items.length) return;
    setCurrentIndex((internalIndex - 1 + items.length) % items.length);
  };
  const handleNext = () => {
    if (!items.length) return;
    setCurrentIndex((internalIndex + 1) % items.length);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };
  const handleDragMove = (e) => {
    if (!isDraggingRef.current) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diff = startXRef.current - x;
    if (diff > 50) {
      handleNext();
      isDraggingRef.current = false;
    } else if (diff < -50) {
      handlePrev();
      isDraggingRef.current = false;
    }
  };
  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  // autoplay: 비제어 모드에서만, setCurrentIndex 경유(부모가 onChange 듣고 싶을 수 있음)
  const indexRef = useRef(internalIndex);
  useEffect(() => {
    indexRef.current = internalIndex;
  }, [internalIndex]);

  useEffect(() => {
    if (!autoPlay || isControlled || items.length < 2) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % items.length;
      setCurrentIndex(next);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, items.length, isControlled]);

  const getCardStyle = (index) => {
    let rel = (index - internalIndex + total) % total;
    if (rel > total / 2) rel -= total;

    if (!isMulti) {
      const isCurrent = index === internalIndex;
      const isNext = index === (internalIndex + 1) % total;
      switch (effectType) {
        case "fade":
          return {
            transform: "translate(-50%, -50%)",
            opacity: isCurrent ? 1 : 0,
            zIndex: isCurrent ? 1 : 0,
            transition: "opacity 0.5s ease"
          };
        case "slide":
          return {
            transform: isCurrent
              ? "translate(-50%, -50%)"
              : isNext
              ? "translate(50%, -50%)"
              : "translate(-150%, -50%)",
            opacity: isCurrent ? 1 : 0,
            zIndex: isCurrent ? 1 : 0,
            transition: "all 0.5s ease"
          };
        case "scale":
          return {
            transform: `translate(-50%, -50%) scale(${isCurrent ? 1 : 0.8})`,
            opacity: isCurrent ? 1 : 0,
            zIndex: isCurrent ? 1 : 0,
            transition: "all 0.5s ease"
          };
        case "stack":
          return {
            transform: `translate(-50%, -50%) translateY(${isCurrent ? 0 : 30}px)`,
            opacity: isCurrent ? 1 : 0,
            zIndex: isCurrent ? 1 : 0,
            transition: "all 0.5s ease"
          };
        default:
          return {
            transform: "translate(-50%, -50%)",
            opacity: isCurrent ? 1 : 0,
            zIndex: isCurrent ? 1 : 0,
            transition: "all 0.5s ease"
          };
      }
    }

    // 다중 아이템 모드
    const leftCount = Math.floor((clamped - 1) / 2);
    const rightCount = Math.ceil((clamped - 1) / 2);

    if (rel < -leftCount || rel > rightCount) {
      return { opacity: 0, pointerEvents: "none", zIndex: 0, transition: "all 0.5s ease" };
    }

    const dist = Math.abs(rel);
    const maxDist = Math.max(leftCount, rightCount) || 1;
    const translateX = rel * (effectiveItemWidth + itemGap);
    const scale = 1 - scaleRatio * (dist / maxDist);
    const opacity = 1 - opacityRatio * (dist / maxDist);
    const zIndex = clamped - dist;

    if (effectType === "overlap") {
      return {
        transform: `translate(calc(-50% + ${translateX}px), -50%) scale(${scale})`,
        opacity,
        zIndex,
        transition: "transform 0.5s ease, opacity 0.5s ease"
      };
    }

    return {
      transform: `translate(calc(-50% + ${translateX}px), -50%)`,
      opacity: 1,
      zIndex,
      transition: "transform 0.5s ease"
    };
  };

  return (
    <div
      ref={containerRef}
      className={mergeClassNames("sud-carousel", className)}
      style={{
        overflow: "hidden",
        cursor: drag ? "grab" : "default",
        userSelect: "none",
        touchAction: "pan-y pinch-zoom",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: width || "100%",
        height:
          height ??
          (containerSize.maxItemHeight > 0 ? containerSize.maxItemHeight : 300),
        minHeight: 300,
        ...style
      }}
      onMouseDown={drag ? handleDragStart : undefined}
      onMouseMove={drag ? handleDragMove : undefined}
      onMouseUp={drag ? handleDragEnd : undefined}
      onMouseLeave={drag ? handleDragEnd : undefined}
      onTouchStart={drag ? handleDragStart : undefined}
      onTouchMove={drag ? handleDragMove : undefined}
      onTouchEnd={drag ? handleDragEnd : undefined}
      role="region"
      aria-roledescription="carousel"
      aria-label="캐러셀"
      {...rest}
    >
      {navBtn && (
        <Button
          className="sud-carousel__btn sud-carousel__btn--left"
          icon={leftBtnIcon}
          onClick={handlePrev}
          colorType="text"
          style={{
            position: "absolute",
            top: "50%",
            left: 10,
            transform: "translateY(-50%)",
            zIndex: 6
          }}
          aria-label="이전 슬라이드"
        />
      )}

      <div
        className="sud-carousel__track"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        role="list"
        aria-label="캐러셀 아이템 목록"
      >
        {items.map((item, index) => (
          <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: effectiveItemWidth,
              ...getCardStyle(index)
            }}
            role="listitem"
            aria-label={`슬라이드 ${index + 1}`}
            aria-hidden={index !== internalIndex}
          >
            {item}
          </div>
        ))}
      </div>

      {navBtn && (
        <Button
          className="sud-carousel__btn sud-carousel__btn--right"
          icon={rightBtnIcon}
          onClick={handleNext}
          colorType="text"
          style={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            zIndex: 6
          }}
          aria-label="다음 슬라이드"
        />
      )}
    </div>
  );
};
