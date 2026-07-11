import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  NotificationRoot,
  notification
} from "../src/components/feedback/NotificationRoot";

describe("NotificationRoot", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls the user onClose callback when manually dismissed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<NotificationRoot />);

    act(() => {
      notification.open({ title: "Update", message: "Done", onClose });
    });

    await user.click(screen.getByRole("button", { name: "Close notification" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Update")).not.toBeInTheDocument();
  });

  it("calls the user callback once after an automatic dismissal", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<NotificationRoot />);

    act(() => {
      notification.open({
        title: "Update",
        message: "Done",
        duration: 100,
        onClose
      });
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Update")).not.toBeInTheDocument();
  });
});
