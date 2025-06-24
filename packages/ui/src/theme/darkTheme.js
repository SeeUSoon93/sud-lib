import { defaultTheme } from "./defaultTheme";

const reverseColorScale = (colors) => {
  const reversed = {};
  Object.entries(colors).forEach(([colorName, scale]) => {
    reversed[colorName] = {};
    Object.entries(scale).forEach(([level, value]) => {
      const newLevel = 11 - parseInt(level);
      reversed[colorName][newLevel] = value;
    });
  });
  return reversed;
};

export const darkTheme = {
  ...defaultTheme,
  colors: reverseColorScale(defaultTheme.colors),
  body: {
    backgroundColor: "black-9",
    color: "black-1"
  },
  shadows: {
    none: "none",
    sm: "0px 0px 4px rgba(0, 0, 0, 0.4)",
    md: "0px 0px 8px rgba(0, 0, 0, 0.5)",
    lg: "0px 0px 12px rgba(0, 0, 0, 0.6)",
    xl: "0px 0px 16px rgba(0, 0, 0, 0.7)"
  }
};
