import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../src/components/general/Button";

describe("Button", () => {
  it("defaults to a non-submitting native button", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "type",
      "button"
    );
  });

  it("forwards native attributes and its ref", () => {
    const ref = createRef();

    render(
      <Button
        ref={ref}
        type="submit"
        name="save"
        value="draft"
        data-testid="save-button"
        aria-label="Save draft"
      />
    );

    const button = screen.getByTestId("save-button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("name", "save");
    expect(button).toHaveAttribute("value", "draft");
    expect(button).toHaveAccessibleName("Save draft");
    expect(ref.current).toBe(button);
  });

  it("blocks clicks and exposes busy state while loading", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>
    );

    const button = screen.getByRole("button", { name: "Save" });
    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
