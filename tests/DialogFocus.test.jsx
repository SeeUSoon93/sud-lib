import { useRef, useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Drawer } from "../src/components/dataDisplay/Drawer";
import { Modal } from "../src/components/dataDisplay/Modal";
import { Radio } from "../src/components/dataEntry/Radio";

const ModalHarness = ({ onClose = () => {} }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>
      <Modal
        open={open}
        title="Settings"
        onClose={() => {
          setOpen(false);
          onClose();
        }}
        footer={<button type="button">Last action</button>}
      >
        <button type="button">First action</button>
      </Modal>
    </>
  );
};

describe("Modal focus management", () => {
  it("locks scroll, traps focus, closes on Escape, and restores focus", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ModalHarness onClose={onClose} />);

    const trigger = screen.getByRole("button", { name: "Open modal" });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "Settings" });
    const closeButton = screen.getByRole("button", { name: "Close modal" });
    const lastButton = screen.getByRole("button", { name: "Last action" });

    await waitFor(() => expect(closeButton).toHaveFocus());
    expect(document.body).toHaveStyle({ overflow: "hidden" });

    lastButton.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(dialog).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("places a later Modal above an active Drawer and keeps top focus when the Drawer closes", async () => {
    const { rerender } = render(
      <>
        <Drawer open title="Navigation" onClose={() => {}}>
          Drawer content
        </Drawer>
        <Modal open title="Confirm" onClose={() => {}}>
          Modal content
        </Modal>
      </>
    );

    const modal = await screen.findByRole("dialog", { name: "Confirm" });
    const drawer = await screen.findByRole("dialog", { name: "Navigation" });
    await waitFor(() => expect(screen.getByRole("button", { name: "Close modal" })).toHaveFocus());

    expect(Number(document.querySelector(".sud-modal__overlay").style.zIndex)).toBeGreaterThan(
      Number(drawer.style.zIndex)
    );

    rerender(
      <>
        <Drawer open={false} title="Navigation" onClose={() => {}}>
          Drawer content
        </Drawer>
        <Modal open title="Confirm" onClose={() => {}}>
          Modal content
        </Modal>
      </>
    );

    expect(modal).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close modal" })).toHaveFocus();
  });

  it("keeps a newly opened Modal above a closing Drawer", async () => {
    const { rerender } = render(
      <>
        <Drawer open title="Navigation" onClose={() => {}}>
          Drawer content
        </Drawer>
        <Modal open={false} title="Confirm" onClose={() => {}}>
          Modal content
        </Modal>
      </>
    );

    const drawer = await screen.findByRole("dialog", { name: "Navigation" });

    rerender(
      <>
        <Drawer open={false} title="Navigation" onClose={() => {}}>
          Drawer content
        </Drawer>
        <Modal open title="Confirm" onClose={() => {}}>
          Modal content
        </Modal>
      </>
    );

    await screen.findByRole("dialog", { name: "Confirm" });
    expect(
      Number(document.querySelector(".sud-modal__overlay").style.zIndex)
    ).toBeGreaterThan(Number(drawer.style.zIndex));
  });

  it("traps Tab at a checked radio group that is the final tab stop", async () => {
    render(
      <Modal open title="Radio dialog" onClose={() => {}}>
        <button type="button">First action</button>
        <Radio name="plan" defaultChecked>
          Free
        </Radio>
        <Radio name="plan">Pro</Radio>
      </Modal>
    );

    const checkedRadio = await screen.findByRole("radio", { name: "Free" });
    const closeButton = screen.getByRole("button", { name: "Close modal" });
    checkedRadio.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    expect(closeButton).toHaveFocus();
  });

  it("composes Modal body clicks without closing the overlay", async () => {
    const onClose = vi.fn();
    const onClick = vi.fn();
    render(
      <Modal open title="Clickable" onClose={onClose} onClick={onClick}>
        Content
      </Modal>
    );

    const dialog = await screen.findByRole("dialog", { name: "Clickable" });
    fireEvent.click(dialog);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });
});
