import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "../src/components/dataEntry/Checkbox";
import { Radio } from "../src/components/dataEntry/Radio";
import { Switch } from "../src/components/dataEntry/Switch";

describe("native form controls", () => {
  it("submits Checkbox values and keeps the boolean callback contract", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ref = createRef();

    render(
      <form data-testid="form">
        <Checkbox ref={ref} name="terms" value="accepted" onChange={onChange}>
          Accept terms
        </Checkbox>
      </form>
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(ref.current).toBe(checkbox);

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true);
    expect(new FormData(screen.getByTestId("form")).get("terms")).toBe(
      "accepted"
    );
  });

  it("renders a valid Checkbox group with native named inputs", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Checkbox.Group
        ariaLabel="Interests"
        name="interests"
        options={[
          { value: "design", label: "Design" },
          { value: "code", label: "Code" }
        ]}
        value={[]}
        onChange={onChange}
      />
    );

    expect(screen.getByRole("group", { name: "Interests" })).toBeInTheDocument();
    const design = screen.getByRole("checkbox", { name: "Design" });
    expect(design).toHaveAttribute("name", "interests");
    expect(design).toHaveAttribute("value", "design");

    await user.click(design);
    expect(onChange).toHaveBeenCalledWith(["design"]);
  });

  it("submits the selected Radio value through its native input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(
      <form data-testid="radio-form">
        <Radio.Group
          ariaLabel="Plan"
          name="plan"
          options={[
            { value: "free", label: "Free" },
            { value: "pro", label: "Pro" }
          ]}
          value={null}
          onChange={onChange}
        />
      </form>
    );

    const pro = screen.getByRole("radio", { name: "Pro" });
    await user.click(pro);
    expect(onChange).toHaveBeenCalledWith("pro");

    rerender(
      <form data-testid="radio-form">
        <Radio.Group
          ariaLabel="Plan"
          name="plan"
          options={[
            { value: "free", label: "Free" },
            { value: "pro", label: "Pro" }
          ]}
          value="pro"
          onChange={onChange}
        />
      </form>
    );

    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(new FormData(screen.getByTestId("radio-form")).get("plan")).toBe(
      "pro"
    );
  });

  it("submits Switch values and forwards its input ref", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ref = createRef();

    render(
      <form data-testid="switch-form">
        <Switch
          ref={ref}
          name="notifications"
          value="enabled"
          ariaLabel="Notifications"
          onChange={onChange}
        />
      </form>
    );

    const control = screen.getByRole("switch", { name: "Notifications" });
    expect(ref.current).toBe(control);

    await user.click(control);

    expect(control).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true);
    expect(
      new FormData(screen.getByTestId("switch-form")).get("notifications")
    ).toBe("enabled");
  });
});
