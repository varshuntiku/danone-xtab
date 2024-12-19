// Function to convert HCV to RGB
function hcvToRgb(hcv) {
    const [hue, chroma, value] = hcv;
    const h = hue / 60;
    const x = chroma * (1 - Math.abs(h % 2 - 1));
    let rgb1;
    if (h >= 0 && h < 1) {
        rgb1 = [chroma, x, 0];
    } else if (h >= 1 && h < 2) {
        rgb1 = [x, chroma, 0];
    } else if (h >= 2 && h < 3) {
        rgb1 = [0, chroma, x];
    } else if (h >= 3 && h < 4) {
        rgb1 = [0, x, chroma];
    } else if (h >= 4 && h < 5) {
        rgb1 = [x, 0, chroma];
    } else {
        rgb1 = [chroma, 0, x];
    }
    const m = value - chroma;
    const [r, g, b] = rgb1.map(component => Math.round((component + m) * 255));
    return [r, g, b];
}

// Function to convert hex to RGB
function hexToRgb(hex) {
    // Remove # if it is there
    hex = hex.replace('#', '');
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
}

// Function to convert RGB to hex
function rgbToHex(rgb) {
    return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

// Function to convert hex to HCV
function hexToHcv(hex) {
    const rgb = hexToRgb(hex);
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    let hue = 0;
    if (chroma !== 0) {
        if (max === r) {
            hue = 60 * (((g - b) / chroma) % 6);
        } else if (max === g) {
            hue = 60 * (((b - r) / chroma) + 2);
        } else {
            hue = 60 * (((r - g) / chroma) + 4);
        }
    }
    if (hue < 0) {
        hue += 360;
    }
    const value = max;
    const result = [hue, chroma, value];
    return result;
}

// Function to convert HCV to hex
function hcvToHex(hcv) {
    const rgb = hcvToRgb(hcv);
    return rgbToHex(rgb);
}

// Function to convert HSL to hex
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;

    let r, g, b;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    let rHex = Math.round((r + m) * 255).toString(16);
    let gHex = Math.round((g + m) * 255).toString(16);
    let bHex = Math.round((b + m) * 255).toString(16);

    rHex = rHex.length === 1 ? "0" + rHex : rHex;
    gHex = gHex.length === 1 ? "0" + gHex : gHex;
    bHex = bHex.length === 1 ? "0" + bHex : bHex;

    return `#${rHex}${gHex}${bHex}`;
}

// Function to convert HSV to hex
function hsvToHex(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return rgbToHex([Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]);
}


// Function to convert color to hex
function colorToHex(color) {
    // If the color is already in hex format
    if (color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
        return color;
    }

    // If the color is in RGB format
    if (color.toLowerCase().indexOf("rgb") === 0) {
        const rgb = color.match(/\d+/g);
        return rgbToHex([parseInt(rgb[0], 10), parseInt(rgb[1], 10), parseInt(rgb[2], 10)]);
    }

    // If the color is in HSL format
    if (color.toLowerCase().indexOf("hsl") === 0) {
        const hsl = color.match(/\d+/g);
        return hslToHex(parseInt(hsl[0], 10), parseInt(hsl[1], 10), parseInt(hsl[2], 10));
    }

    // If the color is in HSV format
    if (color.toLowerCase().indexOf("hsv") === 0) {
        const hsv = color.match(/\d+/g);
        return hsvToHex(parseInt(hsv[0], 10) / 360, parseInt(hsv[1], 10) / 100, parseInt(hsv[2], 10) / 100);
    }

    // If the color format is not recognized
    return "Invalid color format";
}

// Function to darken a color using HCV
export function darkenColor(hexColor, percentage) {
    const hcvColor = hexToHcv(colorToHex(hexColor));
    const newValue = hcvColor[2] * (1 - percentage / 100);
    const newHexColor = hcvToHex([hcvColor[0], hcvColor[1], newValue]);
    return newHexColor;
}

// Function to lighten a color using HCV
export function lightenColor(hexColor, percentage) {
    const hcvColor = hexToHcv(colorToHex(hexColor));
    const newValue = Math.min(100, hcvColor[2] * (1 + percentage / 100));
    const newHexColor = hcvToHex([hcvColor[0], hcvColor[1], newValue]);
    return newHexColor;
}


// Function to generate complementary color using HCV
export function generateComplementaryColor(hexColor) {
    const hcvColor = hexToHcv(colorToHex(hexColor));
    // Calculate the complementary hue
    const complementaryHue = (hcvColor[0] + 180) % 360;
    // Convert back to RGB
    const complementaryRgb = hcvToRgb([complementaryHue, hcvColor[1], hcvColor[2]]);
    // Convert RGB to hex
    return rgbToHex([complementaryRgb[0], complementaryRgb[1], complementaryRgb[2]]);
}


// Function to generate triadic colors using HCV
export function generateTriadicColors(hexColor) {
    const hcvColor = hexToHcv(hexColor);

    // Calculate the triadic colors
    const triadicColor1 = [(hcvColor[0] + 120) % 360, hcvColor[1], hcvColor[2]];
    const triadicColor2 = [(hcvColor[0] + 240) % 360, hcvColor[1], hcvColor[2]];

    return [hcvToHex(triadicColor1), hcvToHex(triadicColor2)];
}


// Function to generate analogous colors using HCV
export function generateAnalogousColors(hexColor) {
    const hcvColor = hexToHcv(hexColor);

    // Calculate the analogous colors
    const analogousColor1 = [(hcvColor[0] + 30) % 360, hcvColor[1], hcvColor[2]];
    const analogousColor2 = [(hcvColor[0] - 30 + 360) % 360, hcvColor[1], hcvColor[2]];

    return [hcvToHex(analogousColor1), hcvToHex(analogousColor2)];
}


export function generateChartColors(c1) {
    c1 = colorToHex(c1);
    const [c4, c7] = generateTriadicColors(c1);

    const [c2, c3] = generateAnalogousColors(c1);
    const [c5, c6] = generateAnalogousColors(c4);

    const [c8, c9] = generateAnalogousColors(c7);

    const [c10] = generateAnalogousColors(c9);

    return [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
}

