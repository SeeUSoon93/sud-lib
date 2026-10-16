import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Skeleton } from "../src/components/feedback/Skeleton";
import { Slider } from "../src/components/dataEntry/Slider";
import { Splitter } from "../src/components/layout/Splitter";
import { ThemeProvider } from "../src/theme/ThemeContext";

describe("Skeleton", () => {
  it("renders a busy placeholder with title and paragraph rows", () => {
    const { container } = render(<Skeleton active paragraph={{ rows: 4 }} />);

    const status = screen.getByRole("status", { name: "Loading" });
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveClass("sud-skeleton--active");
    expect(container.querySelectorAll(".sud-skeleton__title")).toHaveLength(1);
    expect(container.querySelectorAll(".sud-skeleton__row")).toHaveLength(4);
  });

  it("renders children once loading is finished", () => {
    render(<Skeleton loading={false}>Loaded</Skeleton>);
    expect(screen.getByText("Loaded")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

describe("default surface colors", () => {
  const renderBoth = (isDarkMode) =>
    render(
      <ThemeProvider isDarkMode={isDarkMode}>
        <Skeleton />
        <Splitter>
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
        </Splitter>
      </ThemeProvider>
    );

  it("uses the light end of the neutral scale in the light theme", () => {
    const { container } = renderBoth(false);
    const skeleton = container.querySelector(".sud-skeleton").style;
    const splitter = container.querySelector(".sud-splitter").style;
    expect(skeleton.getPropertyValue("--sud-skeleton-base")).toBe("#f5f5f5");
    expect(skeleton.getPropertyValue("--sud-skeleton-highlight")).toBe("#e0e0e0");
    expect(splitter.getPropertyValue("--sud-splitter-bar-color")).toBe("#e0e0e0");
  });

  it("maps the same defaults to dark greys in the dark theme", () => {
    const { container } = renderBoth(true);
    const skeleton = container.querySelector(".sud-skeleton").style;
    const splitter = container.querySelector(".sud-splitter").style;
    expect(skeleton.getPropertyValue("--sud-skeleton-base")).toBe("#2e2e2e");
    expect(splitter.getPropertyValue("--sud-splitter-bar-color")).toBe("#4d4d4d");
  });
});

describe("Slider pointer input", () => {
  it("updates the value from pointer down and move on the track", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 200,
      height: 8,
      top: 0,
      left: 0,
      right: 200,
      bottom: 8
    });
    const onChange = vi.fn();
    const { container } = render(<Slider value={0} onChange={onChange} />);
    const track = container.querySelector(".sud-slider__track");

    fireEvent.pointerDown(track, { pointerId: 3, button: 0, pointerType: "touch", clientX: 50 });
    expect(onChange).toHaveBeenLastCalledWith(25);
    fireEvent.pointerMove(window, { pointerId: 3, clientX: 150 });
    expect(onChange).toHaveBeenLastCalledWith(75);
    fireEvent.pointerUp(window, { pointerId: 3, clientX: 150 });
    fireEvent.pointerMove(window, { pointerId: 3, clientX: 190 });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("slider")).toHaveFocus();
  });
});
