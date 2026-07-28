import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "../src/components/navigation/Pagination";
import { Menu } from "../src/components/navigation/Menu";
import { Accordion } from "../src/components/dataDisplay/Accordion";
import { Collapse } from "../src/components/dataDisplay/Collapse";
import { Tabs } from "../src/components/dataDisplay/Tabs";
import { Rate } from "../src/components/dataEntry/Rate";
import { Carousel } from "../src/components/dataDisplay/Carousel";

describe("navigation and display accessibility regressions", () => {
  it("uses SUD buttons for pagination and clamps invalid values", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Pagination total={0} pageSize={0} onChange={onChange} />);

    expect(screen.getByRole("button", { name: "다음 페이지로 이동" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "다음 페이지로 이동" }));
    expect(onChange).not.toHaveBeenCalled();

    rerender(<Pagination total={Infinity} pageSize={10} onChange={onChange} />);
    expect(screen.getByRole("button", { name: "1 페이지" })).toHaveAttribute("aria-current", "page");

    rerender(<Pagination current={99} total={20} pageSize={10} onChange={onChange} />);
    expect(screen.getByRole("button", { name: "2 페이지" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "이전 페이지로 이동" }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("keeps popover menu selection internally and does not serialize class objects", async () => {
    const user = userEvent.setup();
    render(<Menu expandType="popover" defaultSelectedKey="first" items={[{ key: "first", label: "First" }, { key: "second", label: "Second" }]} />);
    const first = screen.getByRole("menuitem", { name: "First" });
    expect(first.className).not.toContain("[object Object]");
    await user.click(screen.getByRole("menuitem", { name: "Second" }));
    expect(screen.getByRole("menuitem", { name: "Second" }).className).toContain("active");
  });

  it("creates unique accordion and collapse ARIA relationships", () => {
    const accordionItems = [{ key: "same key", label: "Section", children: [{ key: "child key", label: "Child" }] }];
    const collapseItems = [{ key: "same key", label: "Panel", children: "Content" }];
    const { container } = render(<><Accordion items={accordionItems} /><Accordion items={accordionItems} /><Collapse items={collapseItems} /><Collapse items={collapseItems} /></>);
    const ids = [...container.querySelectorAll("[id]")].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => !id.includes(" "))).toBe(true);
    expect(screen.getAllByRole("button", { name: "Panel" })).toHaveLength(2);
  });

  it("does not render an orphaned panel when every tab is disabled", () => {
    render(
      <Tabs
        disabledKeys={["one", "two"]}
        options={[
          { key: "one", label: "One" },
          { key: "two", label: "Two" }
        ]}
      />
    );

    expect(screen.getAllByRole("tab").every((tab) => tab.disabled)).toBe(true);
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
  });

  it("skips disabled tabs during keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<Tabs defaultValue="one" disabledKeys={["two"]} options={[{ key: "one", label: "One", children: "One panel" }, { key: "two", label: "Two", children: "Two panel" }, { key: "three", label: "Three", children: "Three panel" }]} />);
    const one = screen.getByRole("tab", { name: "One" });
    one.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Two" })).toBeDisabled();
  });

  it("uses roving radio buttons for Rate", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rate defaultValue={1} allowHalf onChange={onChange} />);
    const first = screen.getByRole("radio", { name: "1점" });
    first.focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(1.5);
    expect(screen.getByRole("radio", { name: "1.5점" })).toHaveFocus();
  });

  it("makes inactive carousel slides inert", () => {
    const { container } = render(<Carousel items={[<button key="one">One</button>, <button key="two">Two</button>]} />);
    expect(container.querySelector('[aria-label="슬라이드 2"]')).toHaveAttribute("inert", "");
  });
});
