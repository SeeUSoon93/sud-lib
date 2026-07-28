import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Calendar } from "../src/components/dataDisplay/Calendar";
import { ColorPicker } from "../src/components/dataEntry/ColorPicker";
import { Upload } from "../src/components/dataEntry/Upload";
import { NotificationRoot, notification } from "../src/components/feedback/NotificationRoot";
import { Button } from "../src/components/general/Button";
import { PopupBase } from "../src/components/navigation/base/PopupBase";
import { Tooltip } from "../src/components/dataDisplay/Tooltip";

describe("input and popup accessibility", () => {
  it("opens Upload from its keyboard trigger and exposes native removal buttons", async () => {
    const user = userEvent.setup();
    const { container } = render(<Upload ariaLabel="파일 업로드">파일 선택</Upload>);
    const input = screen.getByLabelText("File input");
    const click = vi.spyOn(input, "click");

    const trigger = screen.getByRole("button", { name: "파일 업로드" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(click).toHaveBeenCalledTimes(1);

    fireEvent.change(input, {
      target: { files: [new File(["hello"], "hello.txt", { type: "text/plain" })] }
    });
    expect(container.querySelector(".sud-upload__file-delete")).toHaveAttribute("type", "button");
    expect(screen.getByRole("button", { name: "Remove hello.txt" })).toBeInTheDocument();
  });

  it("lets keyboard users choose a month in Calendar year view", async () => {
    const user = userEvent.setup();
    render(<Calendar view="year" value={new Date(2024, 0, 1)} />);

    const february = screen.getByRole("button", { name: "2024년 2월" });
    february.focus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "2024년 2월 1일" })).toBeInTheDocument()
    );
  });

  it("exposes ColorPicker preset and gradient controls to keyboard users", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <ColorPicker open setOpen={() => {}} mode="preset" onChange={onChange} />
    );

    const preset = screen.getByRole("button", { name: "red 1" });
    preset.focus();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalled();

    rerender(<ColorPicker open setOpen={() => {}} mode="gradient" onChange={onChange} />);
    const palette = screen.getByRole("slider", { name: "색상 채도와 명도" });
    palette.focus();
    await user.keyboard("{ArrowRight}");
    expect(palette).toHaveAttribute("aria-valuenow");
  });

  it("adds popup trigger semantics, keyboard activation, Escape close, and focus tooltip", async () => {
    const user = userEvent.setup();
    render(
      <>
        <PopupBase trigger="click" content="Popup content">Open popup</PopupBase>
        <PopupBase trigger="hover" content="Tooltip content" variant="tooltip">Hover tooltip</PopupBase>
      </>
    );

    const clickTrigger = screen.getByRole("button", { name: "Open popup" });
    clickTrigger.focus();
    await user.keyboard("{Enter}");
    expect(clickTrigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(clickTrigger).toHaveFocus());

    const tooltipTrigger = screen.getByText("Hover tooltip");
    tooltipTrigger.focus();
    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip content")
    );
  });

  it("announces a disabled text trigger without adding it to the tab order", () => {
    render(
      <PopupBase trigger="click" content="Unavailable" disabled>
        Disabled popup
      </PopupBase>
    );

    const trigger = screen.getByRole("button", { name: "Disabled popup" });
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    expect(trigger).toHaveAttribute("tabindex", "-1");
  });

  it("does not serialize a missing Tooltip className into the DOM", () => {
    const { container } = render(
      <Tooltip content="Helpful text">Tooltip trigger</Tooltip>
    );

    const wrapper = container.querySelector(".sud-tooltip");
    expect(wrapper).toHaveClass("sud-tooltip");
    expect(wrapper.className.split(/\s+/)).not.toContain("undefined");
  });

  it("uses a focusable child as the only popup tab stop without double toggling", async () => {
    const user = userEvent.setup();
    render(
      <PopupBase trigger="click" content="Child popup">
        <Button>Open from button</Button>
      </PopupBase>
    );

    expect(screen.getAllByRole("button", { name: "Open from button" })).toHaveLength(1);
    const trigger = screen.getByRole("button", { name: "Open from button" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Child popup")).toBeInTheDocument();
  });

  it("returns focus to a focusable trigger child when a popup closes", async () => {
    const user = userEvent.setup();
    render(
      <PopupBase
        trigger="click"
        closeOnClick={false}
        content={<button type="button">Popup action</button>}
      >
        <Button>Focusable trigger</Button>
      </PopupBase>
    );

    const trigger = screen.getByRole("button", { name: "Focusable trigger" });
    await user.click(trigger);
    const popupAction = screen.getByRole("button", { name: "Popup action" });
    popupAction.focus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("keeps title-less persistent notifications dismissible and announced", async () => {
    const user = userEvent.setup();
    render(<NotificationRoot />);
    act(() => {
      notification.open({ message: "Still here", duration: false });
    });

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Still here"));
    await user.click(screen.getByRole("button", { name: "Close notification" }));
    expect(screen.queryByText("Still here")).not.toBeInTheDocument();
  });
});
