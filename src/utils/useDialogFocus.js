"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

const dialogStack = [];
let bodyLockCount = 0;
let previousBodyOverflow = "";
const DIALOG_LAYER_BASE = 9999;
let nextDialogLayer = DIALOG_LAYER_BASE;

const lockBodyScroll = () => {
  if (bodyLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  bodyLockCount += 1;

  return () => {
    bodyLockCount = Math.max(0, bodyLockCount - 1);
    if (bodyLockCount === 0) {
      document.body.style.overflow = previousBodyOverflow;
    }
  };
};

const hasHiddenOrInertAncestor = (element) => {
  for (let current = element; current; current = current.parentElement) {
    if (
      current.hasAttribute("hidden") ||
      current.getAttribute("aria-hidden") === "true" ||
      current.hasAttribute("inert")
    ) {
      return true;
    }
  }
  return false;
};

const getFocusableElements = (container) => {
  const candidates = Array.from(
    container.querySelectorAll(FOCUSABLE_SELECTOR)
  ).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.disabled &&
      !hasHiddenOrInertAncestor(element)
  );
  const radioGroups = [];

  candidates.forEach((element) => {
    if (element.type !== "radio" || !element.name) return;
    let group = radioGroups.find(
      (entry) => entry.name === element.name && entry.form === element.form
    );
    if (!group) {
      group = { name: element.name, form: element.form, radios: [] };
      radioGroups.push(group);
    }
    group.radios.push(element);
  });

  return candidates.filter((element) => {
    if (element.type !== "radio" || !element.name) return true;
    const group = radioGroups.find(
      (entry) => entry.name === element.name && entry.form === element.form
    );
    const checked = group.radios.find((radio) => radio.checked);
    return element === (checked || group.radios[0]);
  });
};

export const useDialogFocus = ({
  open,
  containerRef,
  onClose,
  closeOnEscape = true,
  lockScroll = true
}) => {
  const onCloseRef = useRef(onClose);
  const [layer, setLayer] = useState(DIALOG_LAYER_BASE);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!open || !container) return undefined;

    const token = {};
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const unlockBody = lockScroll ? lockBodyScroll() : () => {};

    const dialog = { token, layer: nextDialogLayer };
    nextDialogLayer += 2;
    dialogStack.push(dialog);
    setLayer(dialog.layer);

    const focusFrame = requestAnimationFrame(() => {
      const focusTarget =
        container.querySelector("[data-autofocus], [autofocus]") ||
        getFocusableElements(container)[0] ||
        container;
      focusTarget.focus({ preventScroll: true });
    });

    const handleKeyDown = (event) => {
      if (dialogStack[dialogStack.length - 1]?.token !== token) return;

      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!container.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus({ preventScroll: true });
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      const wasTop = dialogStack[dialogStack.length - 1]?.token === token;
      const stackIndex = dialogStack.findIndex((entry) => entry.token === token);
      if (stackIndex >= 0) dialogStack.splice(stackIndex, 1);
      unlockBody();

      if (wasTop && previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [closeOnEscape, containerRef, lockScroll, open]);

  return layer;
};
