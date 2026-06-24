# Surface Guidelines

Sud UI components should not enable border and shadow at the same time by default.

## Defaults

- Content and form surfaces use a border by default and no shadow.
- Floating surfaces use a shadow by default and no border.
- Action components such as `Button` stay flat by default unless the caller asks for a shadow.

## Component Types

- `content`: `Card`, `Collapse`, dense layout panels
- `input`: `Input`, `Select`, form controls
- `floating`: `Modal`, `Drawer`, `PopupBase`, `Dropdown`, overlays
- `action`: `Button`, icon buttons, compact commands

Use `surface`, `border`, and `shadow` to override these defaults explicitly.

## Release Check

Before publishing, run:

```bash
npm run lint
npm run build
npm run check:exports
npm pack --dry-run
```
