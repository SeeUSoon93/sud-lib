# Changelog

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
