import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calendar } from "../src/components/dataDisplay/Calendar";

describe("Calendar controlled state", () => {
  it("clears a controlled single-date selection", () => {
    const { container, rerender } = render(
      <Calendar value={new Date(2024, 5, 15)} />
    );

    expect(container.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);

    rerender(<Calendar value={null} />);

    expect(container.querySelectorAll('[aria-selected="true"]')).toHaveLength(0);
  });

  it("clears controlled range endpoints", () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 10);
    const endDate = new Date(today.getFullYear(), today.getMonth(), 12);
    const { container, rerender } = render(
      <Calendar
        value={null}
        range
        startDate={startDate}
        endDate={endDate}
      />
    );

    expect(container.querySelectorAll('[aria-selected="true"]')).toHaveLength(2);

    rerender(
      <Calendar value={null} range startDate={null} endDate={null} />
    );

    expect(container.querySelectorAll('[aria-selected="true"]')).toHaveLength(0);
  });

  it("renders an initially cleared Year view", () => {
    expect(() => render(<Calendar value={null} view="year" />)).not.toThrow();
  });

  it("keeps a view anchor when switching a cleared calendar to Daily", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Calendar value={new Date(2024, 5, 15)} viewControl />
    );

    rerender(<Calendar value={null} viewControl />);

    await user.click(screen.getByRole("radio", { name: "Daily" }));

    expect(screen.getByRole("radio", { name: "Daily" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});
