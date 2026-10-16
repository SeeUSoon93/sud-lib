import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Splitter,
  computeSplitterSizes,
  resolveSplitterSize
} from "../src/components/layout/Splitter";

const mockRect = (width, height = 400) => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function () {
      if (!this.classList.contains("sud-splitter")) {
        return { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };
      }
      return { width, height, top: 0, left: 0, right: width, bottom: height };
    }
  );
};

const drag = (element, { from = 0, to }) => {
  fireEvent.pointerDown(element, { pointerId: 1, button: 0, pointerType: "mouse", clientX: from, clientY: from });
  fireEvent.pointerMove(window, { pointerId: 1, clientX: to, clientY: to });
  fireEvent.pointerUp(window, { pointerId: 1, clientX: to, clientY: to });
};

describe("Splitter size helpers", () => {
  it("resolves px, percent and string sizes", () => {
    expect(resolveSplitterSize(120, 1000)).toBe(120);
    expect(resolveSplitterSize("25%", 1000)).toBe(250);
    expect(resolveSplitterSize("80px", 1000)).toBe(80);
    expect(resolveSplitterSize(undefined, 1000)).toBeUndefined();
  });

  it("gives remaining space to flexible panels and scales fully sized layouts", () => {
    expect(computeSplitterSizes([200, undefined, 300], 1000)).toEqual([200, 500, 300]);
    expect(computeSplitterSizes([100, 300], 800)).toEqual([200, 600]);
  });
});

describe("Splitter", () => {
  it("resizes adjacent panels by dragging and respects min/max", () => {
    mockRect(1002);
    const onResize = vi.fn();
    const onResizeEnd = vi.fn();

    render(
      <Splitter onResize={onResize} onResizeEnd={onResizeEnd}>
        <Splitter.Panel defaultSize={200} max="25%">Left</Splitter.Panel>
        <Splitter.Panel min="40%">Main</Splitter.Panel>
        <Splitter.Panel defaultSize={300}>Right</Splitter.Panel>
      </Splitter>
    );

    const [firstBar] = screen.getAllByRole("separator");
    drag(firstBar, { to: 30 });
    expect(onResize).toHaveBeenLastCalledWith([230, 470, 300]);
    expect(onResizeEnd).toHaveBeenLastCalledWith([230, 470, 300]);
    expect(screen.getByText("Left").style.flex).toBe("0 0 230px");

    drag(firstBar, { to: 500 });
    // Left panel max is 25% of 1000px.
    expect(onResizeEnd).toHaveBeenLastCalledWith([250, 450, 300]);
  });

  it("keeps the flexible panel minimum when growing a neighbour", () => {
    mockRect(1002);
    const onResizeEnd = vi.fn();

    render(
      <Splitter onResizeEnd={onResizeEnd}>
        <Splitter.Panel defaultSize={200}>Left</Splitter.Panel>
        <Splitter.Panel min="50%">Main</Splitter.Panel>
        <Splitter.Panel defaultSize={300}>Right</Splitter.Panel>
      </Splitter>
    );

    drag(screen.getAllByRole("separator")[1], { to: -400 });
    expect(onResizeEnd).toHaveBeenLastCalledWith([200, 500, 300]);
  });

  it("supports controlled sizes", () => {
    mockRect(1001);
    const Controlled = () => {
      const [sizes, setSizes] = useState([300, 700]);
      return (
        <Splitter onResize={setSizes}>
          <Splitter.Panel size={sizes[0]}>A</Splitter.Panel>
          <Splitter.Panel size={sizes[1]}>B</Splitter.Panel>
        </Splitter>
      );
    };
    render(<Controlled />);

    drag(screen.getByRole("separator"), { to: 100 });
    expect(screen.getByRole("separator")).toHaveAttribute("aria-valuenow", "40");
  });

  it("resizes from the keyboard", async () => {
    mockRect(1001);
    const user = userEvent.setup();
    const onResizeEnd = vi.fn();

    render(
      <Splitter onResizeEnd={onResizeEnd}>
        <Splitter.Panel defaultSize={400}>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>
    );

    const bar = screen.getByRole("separator");
    bar.focus();
    await user.keyboard("{ArrowRight}");
    expect(onResizeEnd).toHaveBeenLastCalledWith([410, 590]);
    await user.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    expect(onResizeEnd).toHaveBeenLastCalledWith([360, 640]);
  });

  it("collapses and restores a collapsible panel", async () => {
    mockRect(1001);
    const user = userEvent.setup();
    const onCollapse = vi.fn();

    render(
      <Splitter onCollapse={onCollapse}>
        <Splitter.Panel defaultSize={250} collapsible>
          Side
        </Splitter.Panel>
        <Splitter.Panel>Main</Splitter.Panel>
      </Splitter>
    );

    await user.click(screen.getByRole("button", { name: "Collapse panel" }));
    expect(onCollapse).toHaveBeenLastCalledWith([true, false], [0, 1000]);
    expect(screen.getByText("Side")).toHaveAttribute("aria-hidden", "true");

    await user.click(screen.getByRole("button", { name: "Expand panel" }));
    expect(onCollapse).toHaveBeenLastCalledWith([false, false], [250, 750]);
  });

  it("does not offer collapse buttons for non-collapsible panels", () => {
    mockRect(1001);
    render(
      <Splitter>
        <Splitter.Panel defaultSize={250}>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("uses the vertical axis in vertical layout", () => {
    mockRect(300, 601);
    const onResizeEnd = vi.fn();
    render(
      <Splitter layout="vertical" onResizeEnd={onResizeEnd}>
        <Splitter.Panel defaultSize={200}>Top</Splitter.Panel>
        <Splitter.Panel>Bottom</Splitter.Panel>
      </Splitter>
    );

    const bar = screen.getByRole("separator");
    expect(bar).toHaveAttribute("aria-orientation", "horizontal");
    drag(bar, { to: 50 });
    expect(onResizeEnd).toHaveBeenLastCalledWith([250, 350]);
  });

  it("ignores drags on bars next to non-resizable panels", () => {
    mockRect(1001);
    const onResize = vi.fn();
    render(
      <Splitter onResize={onResize}>
        <Splitter.Panel defaultSize={300} resizable={false}>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>
    );

    const bar = screen.getByRole("separator");
    expect(bar).toHaveAttribute("aria-disabled", "true");
    drag(bar, { to: 50 });
    expect(onResize).not.toHaveBeenCalled();
  });
});
