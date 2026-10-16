"use client";

import React, {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { mergeClassNames, resolveColor } from "../../../theme/themeUtils";
import { useTheme } from "../../../theme/ThemeContext";
import { useDrag } from "../../../utils/useDrag";

const COLLAPSED_EPSILON = 1;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 패널 크기 값을 px로 변환한다. 숫자는 px, "30%"는 total 대비 비율, "200px"은 px로 해석한다.
 */
export const resolveSplitterSize = (value, total) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  const text = String(value).trim();
  const number = parseFloat(text);
  if (!Number.isFinite(number)) return undefined;
  return text.endsWith("%") ? (total * number) / 100 : number;
};

/**
 * 렌더링 규칙과 같은 방식으로 각 패널의 px 크기를 계산한다.
 * 크기가 없는 패널은 남은 공간을 똑같이 나누고, 모든 패널에 크기가 있으면 비율대로 채운다.
 */
export const computeSplitterSizes = (specs, total) => {
  const resolved = specs.map((spec) => resolveSplitterSize(spec, total));
  const flexCount = resolved.filter((size) => size === undefined).length;
  const fixed = resolved.reduce(
    (sum, size) => sum + (size === undefined ? 0 : Math.max(0, size)),
    0
  );

  if (flexCount > 0) {
    const share = Math.max(0, total - fixed) / flexCount;
    return resolved.map((size) => (size === undefined ? share : Math.max(0, size)));
  }
  if (fixed <= 0) return resolved.map(() => total / Math.max(1, resolved.length));
  return resolved.map((size) => (Math.max(0, size) / fixed) * total);
};

const normalizeCollapsible = (collapsible) => {
  if (!collapsible) return { start: false, end: false, show: "auto" };
  if (collapsible === true) return { start: true, end: true, show: "auto" };
  return {
    start: Boolean(collapsible.start),
    end: Boolean(collapsible.end),
    show: collapsible.showCollapsibleIcon ?? "auto"
  };
};

const CHEVRON_PATHS = {
  left: "M10 3 5 8l5 5",
  right: "M6 3l5 5-5 5",
  up: "M3 10l5-5 5 5",
  down: "M3 6l5 5 5-5"
};

const Chevron = ({ direction }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={CHEVRON_PATHS[direction]} />
  </svg>
);

export const SplitterPanel = ({ children }) => <>{children}</>;
SplitterPanel.displayName = "Splitter.Panel";

const SplitterBase = forwardRef(function Splitter(
  {
    layout = "horizontal",
    children,
    onResizeStart,
    onResize,
    onResizeEnd,
    onCollapse,
    barSize = 1,
    triggerSize = 16,
    barColor = "neutral-8",
    activeColor = "blue-6",
    iconColor = "neutral-5",
    iconActiveColor,
    draggerIcon,
    collapsibleIcon,
    keyboardStep = 10,
    collapseLabels,
    className,
    classNames = {},
    style = {},
    ...rest
  },
  ref
) {
  const theme = useTheme();
  const vertical = layout === "vertical";
  const rootRef = useRef(null);
  const lastSizes = useRef([]);
  const dragState = useRef(null);
  const [innerSizes, setInnerSizes] = useState([]);
  const [containerSize, setContainerSize] = useState(0);
  const [activeBar, setActiveBar] = useState(null);

  const panels = Children.toArray(children).filter(isValidElement);
  const count = panels.length;
  const barsTotal = barSize * Math.max(0, count - 1);
  const panelTotal = Math.max(0, containerSize - barsTotal);

  const setRootRef = useCallback(
    (node) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const measure = useCallback(() => {
    const node = rootRef.current;
    if (!node) return 0;
    const rect = node.getBoundingClientRect();
    const size = vertical ? rect.height : rect.width;
    setContainerSize((prev) => (prev === size ? prev : size));
    return size;
  }, [vertical]);

  useIsomorphicLayoutEffect(() => {
    measure();
    const node = rootRef.current;
    if (!node) return undefined;
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(() => measure());
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure]);

  // 패널 수가 바뀌면 인덱스 기준 내부 크기를 버린다.
  useEffect(() => {
    setInnerSizes((prev) => (prev.length ? [] : prev));
    lastSizes.current = [];
  }, [count]);

  const specs = panels.map((panel, index) => {
    if (panel.props.size !== undefined) return panel.props.size;
    if (innerSizes[index] !== undefined) return innerSizes[index];
    return panel.props.defaultSize;
  });
  const specsKey = specs.map(String).join("|");
  const pxSizes = useMemo(
    () => computeSplitterSizes(specs, panelTotal),
    // specs는 매 렌더 새 배열이므로 직렬화한 값으로 비교한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [specsKey, panelTotal]
  );
  const allDefined = specs.every((spec) => spec !== undefined);
  const config = panels.map((panel) => normalizeCollapsible(panel.props.collapsible));

  const bounds = (index, total) => {
    const panel = panels[index].props;
    const min = Math.max(0, resolveSplitterSize(panel.min, total) ?? 0);
    const max = resolveSplitterSize(panel.max, total) ?? total;
    return [min, Math.max(min, max)];
  };

  const currentSizes = () => {
    const total = Math.max(0, measure() - barsTotal);
    return { total, sizes: computeSplitterSizes(specs, total) };
  };

  const resizePair = (index, total, start, delta) => {
    const a = index;
    const b = index + 1;
    const [minA, maxA] = bounds(a, total);
    const [minB, maxB] = bounds(b, total);
    const lower = Math.max(minA - start[a], start[b] - maxB);
    const upper = Math.min(maxA - start[a], start[b] - minB);
    const applied = lower > upper ? 0 : Math.min(upper, Math.max(lower, delta));
    const next = start.slice();
    next[a] = start[a] + applied;
    next[b] = start[b] - applied;
    return next;
  };

  // 제어되지 않는 패널만 내부 상태에 기록한다. 크기 없는 패널은 짝이 고정 크기면 남은 공간을 흡수한다.
  const commit = (next, pair, baseSpecs) => {
    setInnerSizes((prev) => {
      const copy = panels.map((_, index) => prev[index]);
      pair.forEach((index) => {
        if (panels[index].props.size !== undefined) return;
        const other = index === pair[0] ? pair[1] : pair[0];
        if (baseSpecs[index] === undefined && baseSpecs[other] !== undefined) return;
        copy[index] = next[index];
      });
      return copy;
    });
  };

  const isResizable = (index) =>
    panels[index]?.props.resizable !== false &&
    panels[index + 1]?.props.resizable !== false;

  const { onPointerDown } = useDrag({
    preventDefault: true,
    cursor: vertical ? "row-resize" : "col-resize",
    onStart: (event) => {
      const index = Number(event.currentTarget.dataset.index);
      if (!isResizable(index)) return false;
      event.currentTarget.focus?.({ preventScroll: true });
      const { total, sizes } = currentSizes();
      dragState.current = { index, total, start: sizes, specs, sizes };
      setActiveBar(index);
      onResizeStart?.(sizes);
      return undefined;
    },
    onMove: (_event, { dx, dy }) => {
      const state = dragState.current;
      if (!state) return;
      const next = resizePair(state.index, state.total, state.start, vertical ? dy : dx);
      state.sizes = next;
      commit(next, [state.index, state.index + 1], state.specs);
      onResize?.(next);
    },
    onEnd: () => {
      const state = dragState.current;
      dragState.current = null;
      setActiveBar(null);
      if (state) onResizeEnd?.(state.sizes);
    }
  });

  const restoreSize = (index, total) => {
    const panel = panels[index].props;
    const remembered = lastSizes.current[index];
    if (remembered > COLLAPSED_EPSILON) return remembered;
    const fallback =
      resolveSplitterSize(panel.defaultSize, total) ??
      resolveSplitterSize(panel.min, total);
    return fallback > COLLAPSED_EPSILON ? fallback : total / Math.max(1, count);
  };

  // direction "start"는 분할선을 앞쪽으로, "end"는 뒤쪽으로 옮긴다.
  const getCollapseAction = (index, direction, sizes) => {
    const a = index;
    const b = index + 1;
    const sizeA = sizes[a];
    const sizeB = sizes[b];
    if (direction === "start") {
      if (sizeB < COLLAPSED_EPSILON && config[b].start && sizeA >= COLLAPSED_EPSILON) {
        return { type: "expand", target: b, owner: config[b] };
      }
      if (sizeA >= COLLAPSED_EPSILON && config[a].end) {
        return { type: "collapse", target: a, owner: config[a] };
      }
      return null;
    }
    if (sizeA < COLLAPSED_EPSILON && config[a].end && sizeB >= COLLAPSED_EPSILON) {
      return { type: "expand", target: a, owner: config[a] };
    }
    if (sizeB >= COLLAPSED_EPSILON && config[b].start) {
      return { type: "collapse", target: b, owner: config[b] };
    }
    return null;
  };

  const runCollapse = (index, direction) => {
    const { total, sizes } = currentSizes();
    const action = getCollapseAction(index, direction, sizes);
    if (!action) return;
    const a = index;
    const b = index + 1;
    const giver = action.target === a ? b : a;
    const next = sizes.slice();
    if (action.type === "collapse") {
      lastSizes.current[action.target] = sizes[action.target];
      next[giver] += sizes[action.target];
      next[action.target] = 0;
    } else {
      const amount = Math.min(sizes[giver], restoreSize(action.target, total));
      next[giver] -= amount;
      next[action.target] += amount;
    }
    commit(next, [a, b], specs);
    onCollapse?.(
      next.map((size) => size < COLLAPSED_EPSILON),
      next
    );
  };

  const handleKeyDown = (index) => (event) => {
    if (!isResizable(index)) return;
    const decrease = vertical ? "ArrowUp" : "ArrowLeft";
    const increase = vertical ? "ArrowDown" : "ArrowRight";
    const step = event.shiftKey ? keyboardStep * 5 : keyboardStep;
    let delta;
    if (event.key === decrease) delta = -step;
    else if (event.key === increase) delta = step;
    else if (event.key === "Home") delta = -Infinity;
    else if (event.key === "End") delta = Infinity;
    else if (event.key === "Enter") {
      event.preventDefault();
      const { sizes } = currentSizes();
      const direction = getCollapseAction(index, "start", sizes) ? "start" : "end";
      runCollapse(index, direction);
      return;
    } else return;

    event.preventDefault();
    const { total, sizes } = currentSizes();
    const next = resizePair(index, total, sizes, delta);
    commit(next, [index, index + 1], specs);
    onResize?.(next);
    onResizeEnd?.(next);
  };

  const draggerClassNames =
    typeof classNames.dragger === "string"
      ? { default: classNames.dragger }
      : classNames.dragger || {};

  const panelFlex = (index) => {
    const spec = specs[index];
    if (spec === undefined) return "1 1 0px";
    if (panelTotal > 0) {
      return allDefined
        ? `${Math.max(0, pxSizes[index])} 1 0px`
        : `0 0 ${pxSizes[index]}px`;
    }
    return `0 0 ${typeof spec === "number" ? `${spec}px` : spec}`;
  };

  const renderCollapseButton = (index, direction) => {
    if (panelTotal <= 0) return null;
    const action = getCollapseAction(index, direction, pxSizes);
    if (!action || action.owner.show === false) return null;
    const icon =
      collapsibleIcon?.[direction] ??
      (
        <Chevron
          direction={
            direction === "start"
              ? vertical
                ? "up"
                : "left"
              : vertical
                ? "down"
                : "right"
          }
        />
      );
    const label =
      collapseLabels?.[action.type] ??
      (action.type === "collapse" ? "Collapse panel" : "Expand panel");
    return (
      <button
        type="button"
        className={mergeClassNames(
          "sud-splitter__collapse",
          `sud-splitter__collapse--${direction}`,
          {
            "sud-splitter__collapse--auto": action.owner.show === "auto",
            "sud-splitter__collapse--offset": Boolean(draggerIcon)
          },
          classNames.collapse
        )}
        aria-label={label}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => runCollapse(index, direction)}
      >
        {icon}
      </button>
    );
  };

  let position = 0;
  const items = [];
  panels.forEach((panel, index) => {
    const collapsed = panelTotal > 0 && pxSizes[index] < COLLAPSED_EPSILON;
    items.push(
      <div
        key={panel.key ?? `panel-${index}`}
        className={mergeClassNames(
          "sud-splitter__panel",
          { "sud-splitter__panel--collapsed": collapsed },
          classNames.panel,
          panel.props.className
        )}
        style={{
          flex: panelFlex(index),
          overflow: "auto",
          ...panel.props.style
        }}
        aria-hidden={collapsed || undefined}
      >
        {panel.props.children}
      </div>
    );
    position += pxSizes[index];

    if (index === count - 1) return;
    const resizable = isResizable(index);
    const active = activeBar === index;
    items.push(
      <div
        key={`bar-${index}`}
        className={mergeClassNames(
          "sud-splitter__bar",
          { "sud-splitter__bar--active": active },
          classNames.bar
        )}
        style={{ flex: `0 0 ${barSize}px` }}
      >
        <div
          role="separator"
          tabIndex={resizable ? 0 : -1}
          data-index={index}
          aria-orientation={vertical ? "horizontal" : "vertical"}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={
            panelTotal > 0 ? Math.round((position / panelTotal) * 100) : undefined
          }
          aria-disabled={resizable ? undefined : true}
          className={mergeClassNames(
            "sud-splitter__dragger",
            {
              "sud-splitter__dragger--active": active,
              "sud-splitter__dragger--disabled": !resizable
            },
            draggerClassNames.default,
            active && draggerClassNames.active
          )}
          style={{ [vertical ? "height" : "width"]: triggerSize }}
          onPointerDown={resizable ? onPointerDown : undefined}
          onKeyDown={handleKeyDown(index)}
        >
          {draggerIcon && (
            <span className="sud-splitter__dragger-icon" aria-hidden="true">
              {draggerIcon}
            </span>
          )}
        </div>
        {renderCollapseButton(index, "start")}
        {renderCollapseButton(index, "end")}
      </div>
    );
  });

  return (
    <div
      ref={setRootRef}
      className={mergeClassNames(
        "sud-splitter",
        `sud-splitter--${vertical ? "vertical" : "horizontal"}`,
        className
      )}
      style={{
        "--sud-splitter-bar-color": resolveColor(barColor, theme),
        "--sud-splitter-active-color": resolveColor(activeColor, theme),
        "--sud-splitter-icon-color": resolveColor(iconColor, theme),
        "--sud-splitter-icon-active-color": resolveColor(
          iconActiveColor ?? activeColor,
          theme
        ),
        "--sud-splitter-button-bg": resolveColor("white-10", theme),
        ...style
      }}
      {...rest}
    >
      {items}
    </div>
  );
});

export const Splitter = Object.assign(SplitterBase, { Panel: SplitterPanel });

export default Splitter;
