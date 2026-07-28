import { describe, expect, it } from "vitest";
import { mergeClassNames } from "../src/theme/themeUtils";

describe("mergeClassNames", () => {
  it("merges strings, arrays, and conditional object entries", () => {
    expect(
      mergeClassNames(
        "sud-menu__item",
        ["compact", ["nested"]],
        {
          "sud-menu__item--active": true,
          "sud-menu__item--disabled": false
        }
      )
    ).toBe("sud-menu__item compact nested sud-menu__item--active");
  });

  it("ignores unsupported and false values instead of stringifying them", () => {
    expect(mergeClassNames("base", null, undefined, false, () => {})).toBe(
      "base"
    );
  });
});
