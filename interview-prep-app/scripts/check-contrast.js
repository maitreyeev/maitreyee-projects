function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relLuminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrast(hex1, hex2) {
  const l1 = relLuminance(hexToRgb(hex1));
  const l2 = relLuminance(hexToRgb(hex2));
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

const light = {
  background: "#faf9f7",
  surface: "#ffffff",
  surfaceMuted: "#f3f1ed",
  foreground: "#16151a",
  muted: "#6f6d78",
  accent: "#5b53f0",
  accentInk: "#ffffff",
  success: "#197e4f",
  successSoft: "#e4f6ec",
  warning: "#916108",
  warningSoft: "#fbf0dc",
  danger: "#b83e31",
  dangerSoft: "#fbe9e6",
  white: "#ffffff",
};

const dark = {
  background: "#100f14",
  surface: "#18171e",
  surfaceMuted: "#1f1e26",
  foreground: "#f1efee",
  muted: "#9997a6",
  accent: "#8b84ff",
  accentInk: "#100f14",
  success: "#37c785",
  successSoft: "#163326",
  warning: "#e0a836",
  warningSoft: "#392a10",
  danger: "#e8695c",
  dangerSoft: "#3a1f1c",
  white: "#ffffff",
};

function check(theme, name) {
  console.log(`\n--- ${name} ---`);
  const pairs = [
    ["foreground on background", theme.foreground, theme.background],
    ["foreground on surface", theme.foreground, theme.surface],
    ["muted on background", theme.muted, theme.background],
    ["muted on surface", theme.muted, theme.surface],
    ["muted on surfaceMuted", theme.muted, theme.surfaceMuted],
    ["accentInk on accent (button text)", theme.accentInk, theme.accent],
    ["accent on background (links)", theme.accent, theme.background],
    ["success on successSoft (tags)", theme.success, theme.successSoft],
    ["warning on warningSoft (tags)", theme.warning, theme.warningSoft],
    ["danger on dangerSoft (tags)", theme.danger, theme.dangerSoft],
    ["white on danger (mic recording btn)", theme.white, theme.danger],
  ];
  for (const [label, fg, bg] of pairs) {
    const ratio = contrast(fg, bg);
    const passAA = ratio >= 4.5 ? "PASS AA" : ratio >= 3 ? "PASS AA-large only" : "FAIL";
    console.log(`${label}: ${ratio.toFixed(2)}:1  [${passAA}]`);
  }
}

check(light, "LIGHT MODE");
check(dark, "DARK MODE");
