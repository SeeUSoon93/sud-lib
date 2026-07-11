import { createRef } from "react";
import { Button, Checkbox, Radio } from "../../src/index";

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
