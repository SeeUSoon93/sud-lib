import { afterEach, describe, expect, it, vi } from "vitest";
import {
  applyPulseEffect,
  pulseThumbScaleWithBounce
} from "../src/utils/styleUtils";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("styleUtils motion effects", () => {
  it("restores inline styles after temporary effects finish", () => {
    vi.useFakeTimers();
    const element = document.createElement("button");
    element.style.transform = "rotate(1deg)";
    element.style.transition = "opacity 1s";
    document.body.appendChild(element);

    applyPulseEffect(element);
    pulseThumbScaleWithBounce(element);
    vi.runAllTimers();

    expect(element.style.position).toBe("");
    expect(element.style.transform).toBe("rotate(1deg)");
    expect(element.style.transition).toBe("opacity 1s");
    expect(element.children).toHaveLength(0);
    element.remove();
  });

  it("skips decorative motion when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    const element = document.createElement("button");

    applyPulseEffect(element);
    pulseThumbScaleWithBounce(element);

    expect(element.children).toHaveLength(0);
    expect(element.style.transform).toBe("");
  });
});
