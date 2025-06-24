"use client";
import React, {
  Children,
  cloneElement,
  useRef,
  useState,
  useLayoutEffect
} from "react";

export const Layout = ({
  children,
  siderPosition = "below-header",
  ...rest
}) => {
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const siderRef = useRef(null);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [siderWidth, setSiderWidth] = useState(0);
  useLayoutEffect(() => {
    const resize = () => {
      setHeaderHeight(headerRef.current?.offsetHeight || 0);
      setFooterHeight(footerRef.current?.offsetHeight || 0);
      setSiderWidth(siderRef.current?.offsetWidth || 0);
    };

    resize();

    const observer = new ResizeObserver(resize);
    headerRef.current && observer.observe(headerRef.current);
    footerRef.current && observer.observe(footerRef.current);
    siderRef.current && observer.observe(siderRef.current);

    return () => observer.disconnect();
  }, []);
  let header = null;
  let footer = null;
  let sider = null;
  let content = null;
  const others = [];

  Children.forEach(children, (child) => {
    if (!child?.type) return;

    const name = child.type.displayName;

    if (name === "SUHeader") {
      header = cloneElement(child, {
        ref: headerRef,
        siderPosition,
        siderWidth
      });
    } else if (name === "SUFooter") {
      footer = cloneElement(child, {
        ref: footerRef,
        siderPosition,
        siderWidth
      });
    } else if (name === "SUSider") {
      sider = cloneElement(child, {
        ref: siderRef,
        headerHeight,
        footerHeight,
        siderPosition
      });
    } else if (name === "SUContent") {
      content = cloneElement(child, {
        layoutOffset: {
          header: headerHeight,
          footer: footerHeight,
          sider: siderWidth
        }
      });
    } else {
      others.push(child);
    }
  });

  return (
    <div
      className="sud-layout"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflowY: "hidden",
        overflowX: "hidden"
      }}
      {...rest}
    >
      {siderPosition === "above-header" && sider}
      {header}
      {siderPosition === "below-header" && sider}
      {content}
      {footer}
      {others}
    </div>
  );
};
