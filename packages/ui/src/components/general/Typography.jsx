import "../../index.css";
import { useTheme } from "../../theme/ThemeContext";
import {
  resolveColor,
  getFontStyles,
  mergeClassNames
} from "../../theme/themeUtils";

export const Typography = ({
  children,
  pretendard = "R", // T, EL, L, R, M, SB, B, Black
  gmarket, // Light, Medium, Bold
  suite, // L, R, M, SM, B, EB, H
  code = false,
  fontFamily,
  size = "base",
  weight = "normal",
  as = "span",
  color,
  className = "",
  style = {},
  ...rest
}) => {
  const theme = useTheme();
  const Component = as;

  const { fontSize, fontWeight } = getFontStyles({ size, weight, theme });
  const resolvedColor = color ? resolveColor(color, theme) : undefined;

  // ✅ fontFamily 우선순위 계산
  const finalFontFamily =
    fontFamily ||
    (code && "IntelOneMono-Medium") ||
    (gmarket && `GmarketSans${gmarket}`) ||
    (suite && `SUITE-${suite}`) ||
    (pretendard && `Pretendard-${pretendard}`);

  const shouldUseWeight = !finalFontFamily;

  return (
    <Component
      className={mergeClassNames("sud-typography", className)}
      style={{
        fontSize,
        fontWeight: shouldUseWeight ? fontWeight : undefined,
        fontFamily: finalFontFamily,
        color: resolvedColor,
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        ...style
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};
