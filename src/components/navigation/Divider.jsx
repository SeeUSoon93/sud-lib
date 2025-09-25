import {
  computeColorStyles,
  resolveColor,
  mergeClassNames
} from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";
import { Typography } from "../general/Typography";

export const Divider = ({
  className,
  content,
  align = "center",
  borderWeight = 1,
  borderType = "solid",
  border = true,
  color,
  borderColor,
  colorType = "default",
  width = "100%",
  height = "2em",
  vertical = false,
  style = {},
  ...rest
}) => {
  const theme = useTheme();

  const { txtColor, borColor } = computeColorStyles({
    border,
    fallback: colorType
  });
  const finalTxtColor = color ? resolveColor(color, theme) : txtColor;
  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : borColor;
  const finalBorStyle =
    border && finalBorColor
      ? `${borderWeight}px ${borderType} ${finalBorColor}`
      : "none";

  const getLineStyle = (isFirst) => {
    if (!content) return { flex: 1 };
    if (vertical) {
      if (align === "top") return { flex: isFirst ? 0 : 1 };
      if (align === "bottom") return { flex: isFirst ? 1 : 0 };
      return { flex: 1 };
    } else {
      if (align === "left") return { flex: isFirst ? 0 : 1 };
      if (align === "right") return { flex: isFirst ? 1 : 0 };
      return { flex: 1 };
    }
  };

  return (
    <div
      className={mergeClassNames("sud-divider", className)}
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: vertical ? "auto" : width,
        height: vertical ? height : "auto",
        flexDirection: vertical ? "column" : "row",
        margin: vertical ? "0 1em" : "1em 0",
        gap: content ? "10px" : "0",
        ...style
      }}
      {...rest}
    >
      <div
        className="sud-divider__line"
        style={{
          ...getLineStyle(true),
          [vertical ? "borderLeft" : "borderTop"]: finalBorStyle,
          [vertical ? "width" : "height"]: 0
        }}
      />
      {content && (
        <Typography
          as="span"
          className="sud-divider__content"
          size="sm"
          pretendard="SB"
          color={finalTxtColor}
          style={{
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center"
          }}
        >
          {content}
        </Typography>
      )}
      <div
        className="sud-divider__line"
        style={{
          ...getLineStyle(false),
          [vertical ? "borderLeft" : "borderTop"]: finalBorStyle,
          [vertical ? "width" : "height"]: 0
        }}
      />
    </div>
  );
};
