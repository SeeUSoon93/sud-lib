import { render } from "@testing-library/react";
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
});
