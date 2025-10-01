"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Button } from "../general/Button";
import { AngleLeft, AngleRight } from "sud-icons";
import { mergeClassNames } from "../../theme/themeUtils";

export const Carousel = ({
  items = [],
  itemWidthRatio = 0.8,
  itemCount = 1,
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

  const itemWidth = containerSize.width * itemWidthRatio;

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
    const total = items.length || 1;
    const clamped = Math.min(itemCount, total);

    if (clamped === 1 || effectType !== "overlap") {
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
            transform: `translate(-50%, -50%) translateY(${
              isCurrent ? 0 : 30
            }px)`,
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

    const half = Math.floor(clamped / 2) || 1;
    let rel = (index - internalIndex + total) % total;
    if (rel > total / 2) rel -= total;

    const dist = Math.abs(rel);
    if (dist > half) return { opacity: 0, transform: "scale(0)", zIndex: 0 };

    const maxTranslate = itemWidth * 1.2;
    const translateX = rel * (maxTranslate / half);
    const scale = 1 - scaleRatio * (dist / half);
    const opacity = 1 - opacityRatio * (dist / half);
    const zIndex = clamped - dist;

    switch (effectType) {
      case "fade":
        return {
          transform: "translate(-50%, -50%)",
          opacity,
          zIndex,
          transition: "opacity 0.5s ease"
        };
      case "slide":
        return {
          transform: `translateX(${translateX}px)`,
          opacity: 1,
          zIndex,
          transition: "transform 0.5s ease"
        };
      case "scale":
        return {
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity: 1,
          zIndex,
          transition: "transform 0.5s ease"
        };
      case "stack":
        return {
          transform: `translate(-50%, -50%) translateY(${rel * 30}px)`,
          opacity: 1,
          zIndex,
          transition: "transform 0.5s ease"
        };
      case "overlap":
        return {
          transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
          opacity,
          zIndex,
          transition: "transform 0.5s ease, opacity 0.5s ease"
        };
    }
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
              width: itemWidth,
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
