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
  ...rest
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  const itemRefs = useRef([]);
  useLayoutEffect(() => {
    if (!itemRefs.current) return;
    const maxHeight = Math.max(
      ...itemRefs.current.map((el) => el?.offsetHeight || 0)
    );
    setContainerSize((prev) => ({ ...prev, maxItemHeight: maxHeight }));
  }, [items, currentIndex]);

  // 컨테이너 크기 감지
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const itemWidth = containerSize.width * itemWidthRatio;

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startXRef.current = e.clientX || e.touches[0].clientX;
  };

  const handleDragMove = (e) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX || e.touches[0].clientX;
    const diff = startXRef.current - currentX;

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

  const getCardStyle = (index) => {
    const totalCards = items.length;
    const clampedItemCount = Math.min(itemCount, totalCards);

    if (clampedItemCount === 1 || effectType !== "overlap") {
      const isCurrent = index === currentIndex;
      const isNext = index === (currentIndex + 1) % totalCards;
      const isPrev = index === (currentIndex - 1 + totalCards) % totalCards;

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

    const half = Math.floor(clampedItemCount / 2) || 1;
    let relativeIndex = (index - currentIndex + totalCards) % totalCards;
    if (relativeIndex > totalCards / 2) relativeIndex -= totalCards;

    const distance = Math.abs(relativeIndex);
    if (distance > half) {
      return {
        opacity: 0,
        transform: "scale(0)",
        zIndex: 0
      };
    }

    const maxTranslate = itemWidth * 1.2;
    const translateX = relativeIndex * (maxTranslate / half);
    const scale = 1 - scaleRatio * (distance / half);
    const opacity = 1 - opacityRatio * (distance / half);
    const zIndex = clampedItemCount - distance;

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
          transform: `translate(-50%, -50%) translateY(${
            relativeIndex * 30
          }px)`,
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

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, currentIndex]);

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
        height: height || containerSize.maxItemHeight,
        minHeight: "300px", // 기본 최소 높이
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
            left: "10px",
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
            aria-hidden={index !== currentIndex}
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
            right: "10px",
            transform: "translateY(-50%)",
            zIndex: 6
          }}
          aria-label="다음 슬라이드"
        />
      )}
    </div>
  );
};
