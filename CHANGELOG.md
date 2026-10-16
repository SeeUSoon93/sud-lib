# Changelog

## 2.1.0

### New components

- `Splitter` and `Splitter.Panel`: resizable panel layouts (horizontal or
  vertical) with controlled or uncontrolled sizes, px/percent `min`/`max`,
  collapsible panels, keyboard resizing (arrow keys, Shift, Home/End, Enter),
  and `onResizeStart` / `onResize` / `onResizeEnd` / `onCollapse` callbacks
  that report px sizes. Each panel is its own stacking context, so positioned
  panel content cannot cover the resize bar or its collapse buttons.
- `Skeleton`: loading placeholder with title, paragraph rows, avatar, and an
  optional shimmer animation that honors reduced-motion preferences.

### Behavior

- Slider dragging now uses Pointer Events, so it works with touch and pen
  input as well as the mouse. Pressing the track or thumb starts one drag
  instead of two.
- `Menu` in popover mode now resolves theme color tokens such as `"red-8"`
  for `selectedColor`, `selectedTextColor`, `hoverColor`, and
  `hoverTextColor`, matching accordion mode.
- Accordion (and `Menu` in its default accordion mode) no longer sets
  `aria-label="[object Object]"` when an item label is a React node.

## 2.0.1

### Accessibility and behavior

- Pagination now uses SUD `Button` controls, supports controlled `current`
  values, clamps invalid ranges, and exposes the active page with
  `aria-current`.
- Menu selection now works in uncontrolled popover mode without serializing
  conditional class objects into the DOM.
- Accordion, Collapse, Tabs, Rate, Calendar, Upload, ColorPicker, and Carousel
  now provide stronger keyboard, focus, and ARIA behavior.
- Popup and Tooltip triggers open from keyboard focus, close with Escape, avoid
  duplicate tab stops around interactive children, and restore trigger focus.
- Persistent notifications remain dismissible even when no title is supplied.
- FloatButton exposes its actual expanded state, keeps closed actions out of
  the tab order, and supports Escape dismissal with focus restoration.
- Temporary pulse effects restore the element's original inline styles and
  honor reduced-motion preferences.

### Packaging

- Keep `dayjs` and `sud-icons` external to the library bundle so consuming
  applications resolve the declared dependencies instead of receiving duplicate
  copies.
- Exclude local demo assets and internal planning notes from the npm tarball.
- Retain source maps for production debugging, with package-content checks to
  prevent accidental asset or documentation leakage.
- Add package, packed-install, and React 18/19 CI verification.

### Tooling

- Declare the supported Node.js runtime and public npm publish access.

## 2.0.0

This release establishes the first fully audited stability baseline for SUD UI.

### Breaking changes

- `Button` defaults to `type="button"`. Set `type="submit"` explicitly for form
  submission.
- `Button`, `Card`, `Checkbox`, `Radio`, and `Switch` now forward refs to their
  native DOM elements.
- `Checkbox`, `Radio`, and `Switch` render native `<input>` elements. Their existing
  boolean `onChange` callback remains unchanged, while `name`, `value`,
  `required`, native ARIA attributes, and form submission now work.
- `Checkbox.Group` now uses the valid ARIA role `group` instead of
  `checkboxgroup`.
- `Modal` and `Drawer` manage initial focus, focus trapping, Escape dismissal,
  focus restoration, and body scroll locking.

### Fixes

- Controlled Calendar selections and ranges clear correctly when values become
  `null`.
- Notification `onClose` is no longer overwritten by the internal removal
  handler.
- Toast and notification global handlers and delayed-removal timers are cleaned
  up on unmount.
- ThemeProvider restores the previous body colors when it unmounts.
- The packaged client entry preserves the `"use client"` directive.
- Public declaration files no longer conflict with native React DOM attributes.
- `Breadcrumb` destinations render as native links, and `TimeSelector` options
  use keyboard-operable buttons.
- Image preview supports keyboard activation, Escape dismissal, focus trapping,
  focus restoration, and an explicit close button.
- SUD animations and transitions honor the operating system's reduced-motion
  preference.
- Layout offsets no longer leak `footerHeight` to the DOM, and Sider height now
  accounts for the footer.

### Tooling

- npm is the canonical package manager and the stale pnpm workspace lockfile was
  removed.
- The release candidate runs lint, runtime tests, declaration tests, build,
  export checks, and package-integrity checks before packing.
