import React, {
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
  useCallback
} from "react";
import { Typography } from "../general/Typography";
import { CircleDotFill } from "sud-icons";
import {
  useTheme,
  resolveColor,
  computeColorStyles,
  mergeClassNames
} from "../../theme";

const styles = `
@keyframes timelineItemAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sud-timeline__item {
  animation: timelineItemAppear 0.3s ease-out forwards;
}

.sud-timeline__item-tail {
  transition: height 0.3s ease-out;
}

.sud-timeline__item-head {
  transition: transform 0.2s ease-out;
}

.sud-timeline__item-head:hover {
  transform: scale(1.1);
}
`;

export const Timeline = React.memo(
  ({ items = [], mode = "left", style = {}, className, ...rest }) => {
    const hasAnyLabel = useMemo(
      () => items.some((item) => item.label),
      [items]
    );
    const forceCenter = hasAnyLabel;

    useLayoutEffect(() => {
      if (!document.getElementById("sud-timeline-styles")) {
        const styleSheet = document.createElement("style");
        styleSheet.id = "sud-timeline-styles";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
      }
    }, []);

    const renderContent = useCallback((value, align = "left", txtColor) => {
      if (!value) return null;
      const style = { color: txtColor, textAlign: align };
      if (Array.isArray(value)) {
        return (
          <div style={style}>
            {value.map((item, i) =>
              typeof item === "string" ? (
                <Typography
                  as="div"
                  key={i}
                  color={txtColor}
                  style={{ marginBottom: i === value.length - 1 ? 0 : 4 }}
                >
                  {item}
                </Typography>
              ) : (
                <div
                  key={i}
                  style={{ marginBottom: i === value.length - 1 ? 0 : 4 }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        );
      }
      return (
        <div style={style}>
          {typeof value === "string" ? (
            <Typography as="span" color={txtColor}>
              {value}
            </Typography>
          ) : (
            value
          )}
        </div>
      );
    }, []);

    const dotSize = useMemo(() => 20, []);
    const tailWidth = useMemo(() => 2, []);

    return (
      <div
        className={mergeClassNames("sud-timeline", className)}
        role="list"
        aria-label="타임라인"
        style={{
          position: "relative",
          width: "100%",
          margin: 0,
          padding: 0,
          ...style
        }}
        {...rest}
      >
        {items.map((item, idx) => {
          const hasLabel = !!item.label;
          const hasContent = !!item.content;

          let leftContent = null;
          let rightContent = null;
          let dotPosition = "center";

          if (hasLabel && hasContent) {
            // label + content → always center
            if (mode === "alternate") {
              if (idx % 2 === 0) {
                leftContent = item.label;
                rightContent = item.content;
              } else {
                leftContent = item.content;
                rightContent = item.label;
              }
            } else if (mode === "left") {
              leftContent = item.label;
              rightContent = item.content;
            } else if (mode === "right") {
              leftContent = item.content;
              rightContent = item.label;
            }
          } else if (hasContent && !hasLabel) {
            // content only
            if (forceCenter) {
              // one line has label → all center
              if (mode === "alternate") {
                if (idx % 2 === 0) {
                  leftContent = null;
                  rightContent = item.content;
                } else {
                  leftContent = item.content;
                  rightContent = null;
                }
              } else if (mode === "left") {
                leftContent = null;
                rightContent = item.content;
              } else if (mode === "right") {
                leftContent = item.content;
                rightContent = null;
              }
            } else {
              // no label anywhere → align to side
              if (mode === "left") {
                dotPosition = "left";
                rightContent = item.content;
              } else if (mode === "right") {
                dotPosition = "right";
                leftContent = item.content;
              } else if (mode === "alternate") {
                dotPosition = "center";
                if (idx % 2 === 0) {
                  leftContent = null;
                  rightContent = item.content;
                } else {
                  leftContent = item.content;
                  rightContent = null;
                }
              }
            }
          } else {
            return null; // label only or empty → 무시
          }

          return (
            <TimelineItem
              key={item.key || idx}
              dot={item.dot}
              color={item.color}
              leftContent={leftContent}
              rightContent={rightContent}
              dotPosition={dotPosition}
              isLast={idx === items.length - 1}
              textAlignMode={mode}
              className={mergeClassNames("sud-timeline__item", item.className)}
              role="listitem"
              aria-label={`${idx + 1}번째 타임라인 항목`}
              dotSize={dotSize}
              tailWidth={tailWidth}
              renderContent={renderContent}
              delay={idx * 100}
            />
          );
        })}
      </div>
    );
  }
);

Timeline.displayName = "Timeline";

const TimelineItem = React.memo(
  ({
    dot,
    color = "cerulean",
    leftContent,
    rightContent,
    dotPosition = "center",
    isLast = false,
    textAlignMode = "left",
    className,
    role,
    "aria-label": ariaLabel,
    dotSize,
    tailWidth,
    renderContent,
    delay = 0
  }) => {
    const theme = useTheme();
    const finalColor = resolveColor(color, theme);
    const { txtColor, borColor } = computeColorStyles({
      border: true,
      fallback: "default"
    });

    const leftRef = useRef();
    const rightRef = useRef();
    const [tailHeight, setTailHeight] = useState(0);

    useLayoutEffect(() => {
      const updateHeight = () => {
        const leftH = leftRef.current?.offsetHeight || 0;
        const rightH = rightRef.current?.offsetHeight || 0;
        setTailHeight(dotSize + Math.max(leftH, rightH));
      };

      const resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });

      if (leftRef.current) {
        resizeObserver.observe(leftRef.current);
      }
      if (rightRef.current) {
        resizeObserver.observe(rightRef.current);
      }

      // 초기 높이 설정
      updateHeight();

      return () => {
        resizeObserver.disconnect();
      };
    }, [leftContent, rightContent, dotSize]);

    const dotColumnStyle = useMemo(
      () => ({
        position: "relative",
        width: dotSize,
        minWidth: dotSize
      }),
      [dotSize]
    );

    const tailStyle = useMemo(
      () => ({
        position: "absolute",
        left: (dotSize - tailWidth) / 2,
        top: dotSize / 2,
        width: tailWidth,
        height: isLast ? 0 : tailHeight,
        backgroundColor: borColor
      }),
      [dotSize, tailWidth, tailHeight, isLast, borColor]
    );

    const headStyle = useMemo(
      () => ({
        position: "absolute",
        top: 0,
        left: 0,
        width: dotSize,
        height: dotSize,
        borderRadius: "50%",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }),
      [dotSize]
    );

    const itemStyle = useMemo(
      () => ({
        animationDelay: `${delay}ms`
      }),
      [delay]
    );

    const isCustomDot = React.isValidElement(dot);
    const finalDot = isCustomDot ? (
      React.cloneElement(dot, {
        size: dot.props?.size || dotSize,
        color: dot.props?.color || finalColor
      })
    ) : (
      <CircleDotFill size={dotSize} color={finalColor} />
    );

    if (dotPosition === "center") {
      return (
        <div
          className={mergeClassNames("sud-timeline__item-center", className)}
          role={role}
          aria-label={ariaLabel}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 20,
            marginBottom: 24,
            alignItems: "start",
            ...itemStyle
          }}
        >
          <div
            ref={leftRef}
            className="sud-timeline__item-left"
            role="presentation"
          >
            {renderContent(leftContent, "right", txtColor)}
          </div>
          <div
            style={dotColumnStyle}
            className="sud-timeline__item-dot"
            role="presentation"
          >
            <div
              style={tailStyle}
              className="sud-timeline__item-tail"
              role="presentation"
            />
            <div
              style={headStyle}
              className="sud-timeline__item-head"
              role="presentation"
            >
              {finalDot}
            </div>
          </div>
          <div
            ref={rightRef}
            className="sud-timeline__item-right"
            role="presentation"
          >
            {renderContent(rightContent, "left", txtColor)}
          </div>
        </div>
      );
    }

    return (
      <div
        className={mergeClassNames(
          "sud-timeline__item-side",
          `sud-timeline__item-${dotPosition}`,
          className
        )}
        role={role}
        aria-label={ariaLabel}
        style={{
          display: "grid",
          gridTemplateColumns: dotPosition === "left" ? "auto 1fr" : "1fr auto",
          gap: 20,
          marginBottom: 24,
          alignItems: "start",
          ...itemStyle
        }}
      >
        {dotPosition === "left" ? (
          <>
            <div
              style={dotColumnStyle}
              className="sud-timeline__item-dot"
              role="presentation"
            >
              <div
                style={tailStyle}
                className="sud-timeline__item-tail"
                role="presentation"
              />
              <div
                style={headStyle}
                className="sud-timeline__item-head"
                role="presentation"
              >
                {finalDot}
              </div>
            </div>
            <div
              ref={rightRef}
              className="sud-timeline__item-right"
              role="presentation"
            >
              {renderContent(rightContent, "left", txtColor)}
            </div>
          </>
        ) : (
          <>
            <div
              ref={leftRef}
              className="sud-timeline__item-left"
              role="presentation"
            >
              {renderContent(leftContent, "right", txtColor)}
            </div>
            <div
              style={dotColumnStyle}
              className="sud-timeline__item-dot"
              role="presentation"
            >
              <div
                style={tailStyle}
                className="sud-timeline__item-tail"
                role="presentation"
              />
              <div
                style={headStyle}
                className="sud-timeline__item-head"
                role="presentation"
              >
                {finalDot}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

TimelineItem.displayName = "TimelineItem";
