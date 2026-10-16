import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Image } from "../src/components/dataDisplay/Image";
import { TimeSelector } from "../src/components/dataEntry/TimeSelector";
import { Breadcrumb } from "../src/components/navigation/Breadcrumb";
import { Sider } from "../src/components/layout/Sider";
import { Menu } from "../src/components/navigation/Menu";

describe("accessible component interactions", () => {
  it("names accordion menu items from node labels instead of [object Object]", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Menu
        items={[{ key: "convert", label: <span>Convert note</span>, onClick }]}
      />
    );

    const item = screen.getByRole("button", { name: "Convert note" });
    expect(item).not.toHaveAttribute("aria-label");
    await user.click(item);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders Breadcrumb destinations as native links", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/home" },
          { label: "Current" }
        ]}
      />
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/home"
    );
  });

  it("lets keyboard users select time values through native buttons", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeSelector step={30} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "시 09" }));
    await user.click(screen.getByRole("button", { name: "분 30" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const selected = onChange.mock.calls[0][0];
    expect(selected).toBeInstanceOf(Date);
    expect(selected.getHours()).toBe(9);
    expect(selected.getMinutes()).toBe(30);
  });

  it("opens and closes Image preview from the keyboard", async () => {
    const user = userEvent.setup();

    render(<Image src="/team.png" alt="Team photo" />);

    const trigger = screen.getByRole("button", {
      name: "Preview Team photo"
    });
    trigger.focus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("dialog", { name: "이미지 미리보기" })
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "이미지 미리보기" })
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("uses Layout offsets without leaking custom props to the DOM", () => {
    render(<Sider footerHeight={80}>Navigation</Sider>);

    const sider = screen.getByText("Navigation").closest(".sud-sider");
    expect(sider).not.toHaveAttribute("footerHeight");
    expect(sider).toHaveStyle({ height: "calc(100% - 80px)" });
  });
});
