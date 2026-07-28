import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FloatButton } from "../src/components/general/FloatButton";

describe("FloatButton", () => {
  it("exposes its real expanded state and removes closed actions from tab order", async () => {
    const user = userEvent.setup();
    render(
      <FloatButton
        ariaLabel="Quick actions"
        actions={[
          {
            ariaLabel: "Change theme",
            icon: <span aria-hidden="true">T</span>,
            onClick: vi.fn()
          }
        ]}
      />
    );

    const trigger = screen.getByRole("button", { name: "Quick actions" });
    const action = screen.getByRole("button", { name: "Change theme", hidden: true });
    const actions = document.getElementById(
      trigger.getAttribute("aria-controls")
    );

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(actions).toHaveAttribute("aria-hidden", "true");
    expect(action).toHaveAttribute("tabindex", "-1");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(actions).toHaveAttribute("aria-hidden", "false");
    expect(action).not.toHaveAttribute("tabindex");

    action.focus();
    await user.keyboard("{Escape}");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});
