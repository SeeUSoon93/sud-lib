import { createRef, type ComponentType } from "react";
import {
  Accordion,
  Avatar,
  Button,
  Calendar,
  Carousel,
  Checkbox,
  Collapse,
  ColorPicker,
  DatePicker,
  Menu,
  Pagination,
  Radio,
  Rate,
  Select,
  Skeleton,
  Splitter,
  Tabs,
  Tooltip,
  Upload
} from "../../src/index";

const buttonRef = createRef<HTMLButtonElement>();
const checkboxRef = createRef<HTMLInputElement>();
const radioRef = createRef<HTMLInputElement>();

export const button = (
  <Button
    ref={buttonRef}
    type="submit"
    name="save"
    value="draft"
    aria-label="Save draft"
  />
);

export const checkbox = (
  <Checkbox ref={checkboxRef} name="terms" value="accepted" required>
    Accept terms
  </Checkbox>
);

export const radio = (
  <Radio ref={radioRef} name="plan" value="pro" required>
    Pro
  </Radio>
);

export const splitter = (
  <Splitter
    layout="horizontal"
    onResize={(sizes: number[]) => sizes}
    onCollapse={(collapsed: boolean[], sizes: number[]) => [collapsed, sizes]}
    classNames={{ dragger: { default: "bar", active: "bar-active" } }}
    collapsibleIcon={{ start: "<", end: ">" }}
  >
    <Splitter.Panel size={240} min="10%" max="40%" collapsible={{ start: true, end: true, showCollapsibleIcon: "auto" }}>
      Side
    </Splitter.Panel>
    <Splitter.Panel>Main</Splitter.Panel>
  </Splitter>
);

export const skeleton = (
  <Skeleton active avatar={{ size: 32 }} paragraph={{ rows: 2, width: ["80%", "60%"] }}>
    Loaded
  </Skeleton>
);

type AssertComponent<T extends ComponentType<any>> = T;

// These components cover the public interactive surface that is most prone to
// manual declaration drift. Importing from the package root also verifies that
// default declarations are correctly exposed as named public exports.
type PublicInteractiveComponents = [
  AssertComponent<typeof Accordion>,
  AssertComponent<typeof Avatar>,
  AssertComponent<typeof Calendar>,
  AssertComponent<typeof Carousel>,
  AssertComponent<typeof Collapse>,
  AssertComponent<typeof ColorPicker>,
  AssertComponent<typeof DatePicker>,
  AssertComponent<typeof Menu>,
  AssertComponent<typeof Pagination>,
  AssertComponent<typeof Rate>,
  AssertComponent<typeof Select>,
  AssertComponent<typeof Tabs>,
  AssertComponent<typeof Tooltip>,
  AssertComponent<typeof Upload>
];

export type { PublicInteractiveComponents };
