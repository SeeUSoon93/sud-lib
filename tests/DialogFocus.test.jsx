import { useRef, useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "../src/components/dataDisplay/Modal";

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
});
