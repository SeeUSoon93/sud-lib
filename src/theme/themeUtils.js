import { useTheme } from "./ThemeContext";

// 색상 스타일 계산
export const computeColorStyles = ({
  border = true,
  fallback = "default",
  componentType = "button"
} = {}) => {
  const theme = useTheme();

  const typeStyles = theme.components?.[componentType]?.[fallback] || {};

  const bgColor = resolveColor(typeStyles.bg, theme);
  const txtColor = resolveColor(typeStyles.txt, theme);
  const borColor =
    border && typeStyles.border ? resolveColor(typeStyles.border, theme) : null;

  if (componentType === "breadcrumb") {
    const separator = resolveColor(typeStyles.separator, theme);
    const text = resolveColor(typeStyles.text, theme);
    const now = resolveColor(typeStyles.now, theme);
    return {
      separator,
      text,
      now
    };
  }

  return {
    bgColor,
    txtColor,
    borColor
  };
};

/**
 * 색상 문자열 파싱
 * @param {string} colorString - 파싱할 색상 문자열 (예: "red-5")
 * @returns {{color: string, intensity: number}} 파싱된 색상 정보
 */
export const parseColorString = (colorString) => {
  if (!colorString) return { color: undefined, intensity: undefined };
  const match = colorString.match(/^(.+)-(\d+)$/);
  if (!match) return { color: colorString, intensity: undefined };
  return { color: match[1], intensity: parseInt(match[2], 10) };
};

/**
 * 색상 문자열을 실제 색상 값으로 변환
 * @param {string} colorString - 변환할 색상 문자열
 * @param {Object} theme - 테마 객체
 * @returns {string} 변환된 색상 값
 */
export const resolveColor = (colorString, theme) => {
  if (!colorString) return "";
  if (colorString === "transparent") return "transparent";
  if (colorString.startsWith("#")) return colorString;

  const { color, intensity } = parseColorString(colorString);

  if (theme.colors?.[color]) {
    return intensity ? theme.colors[color][intensity] : theme.colors[color][6];
  }

  return colorString;
};

/**
 * 색상 밝기 조정
 * @param {string} hex - HEX 색상 코드
 * @param {number} percent - 조정할 퍼센트 (-100 ~ 100)
 * @returns {string} 조정된 HEX 색상 코드
 */
export const adjustBrightness = (hex, percent) => {
  if (!hex || !hex.startsWith("#")) return hex;
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  r = Math.min(255, Math.round(r + ((255 - r) * percent) / 100));
  g = Math.min(255, Math.round(g + ((255 - g) * percent) / 100));
  b = Math.min(255, Math.round(b + ((255 - b) * percent) / 100));

  const toHex = (v) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * 강도를 가진 색상 문자열 생성
 * @param {string} color - 기본 색상
 * @param {number} intensity - 색상 강도 (1-10)
 * @param {Object} theme - 테마 객체
 * @returns {string} 강도를 가진 색상 문자열
 */
export const getColorWithIntensity = (color, intensity = 1, theme) => {
  if (!theme?.colors?.[color]) return color;
  return theme.colors[color][intensity] || color;
};

/**
 * 조건부 클래스 네이밍 유틸
 * @param {...string} args - 클래스 이름들
 * @returns {string} 병합된 클래스 문자열
 */
export const mergeClassNames = (...args) => args.filter(Boolean).join(" ");

/**
 * 그림자 스타일 반환
 * @param {string} shadow - 그림자 타입
 * @param {Object} theme - 테마 객체
 * @returns {string} 그림자 스타일
 */
export const getShadowStyle = (shadow = "", theme) => {
  if (theme?.shadows?.[shadow]) return theme.shadows[shadow];
  return "none";
};

/**
 * 모양 스타일 반환
 * @param {string} shape - 모양 타입
 * @param {Object} theme - 테마 객체
 * @returns {Object} 모양 스타일 객체
 */
export const getShapeStyles = (shape = "rounded", theme) =>
  theme?.shapes?.[shape] || {
    borderRadius: "10px",
    paddingLeft: "14px",
    paddingRight: "14px"
  };
export const getFontStyles = ({ size, weight, theme }) => {
  return {
    fontSize: theme.typography.fontSize?.[size] || "1rem",
    fontWeight: theme.typography.fontWeight?.[weight] || 400
  };
};
/**
 * 펄스 효과 적용
 * @param {HTMLElement} element - 효과를 적용할 요소
 */
export const applyPulseEffect = (element) => {
  element.style.animation = "none";
  element.offsetHeight; // 리플로우 강제
  element.style.animation = "pulse 0.3s ease-in-out";
};

/**
 * 썸네일 스케일 바운스 효과
 * @param {HTMLElement} element - 효과를 적용할 요소
 */
export const pulseThumbScaleWithBounce = (element) => {
  element.style.animation = "none";
  element.offsetHeight; // 리플로우 강제
  element.style.animation = "thumbScale 0.3s ease-in-out";
};
