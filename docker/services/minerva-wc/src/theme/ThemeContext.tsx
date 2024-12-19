import { Context, VNode, createContext } from "preact";
import "./theme.scss";
// import { darkenColor, lightenColor } from "../util/colorUtil";
type ThemeValuesType = {
  bgMain?: string;
  bgSecondaryBlue?: string;
  bgSecondaryLightBlue?: string;
  borderBlue?: string;
  textColor?: string;
  contrastColor?: string;
  contrastColor2?: string;
  fontFamily?: string;
  chartColors?: Array<string>;
  mode?: "dark" | "light";
  // chartColor?: string
};
export const ThemeContext: Context<ThemeValuesType> = createContext(null);
export default function ThemeProvider({
  children,
  themeValues,
}: {
  themeValues: ThemeValuesType;
  children: VNode | Array<VNode>;
}) {
  /**
   * Todo: Optimize usinging useMemo/useState/useEffect
   */
  // let {
  //     bgMain = "#E5E5E5",
  //     bgDark = "#FFFFFF",
  //     bgLight = "#F5F5F5",
  //     textColor = "#000",
  //     contrastColor = "#3277B3",
  //     fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif',
  //     chartColors = ['#7FD3BE', '#3277B3', '#FFAD69', '#FE6A9C', '#7ACFFF', '#018786', '#81D290', '#F7C43D', '#D3A6EE', '#8DE6E7'],
  //     mode = "light",
  // } = themeValues || {};
  let {
    bgMain = "#FFFFFF",
    bgSecondaryBlue = "#C9DEF4",
    bgSecondaryLightBlue = "#E9F2FB",
    borderBlue = "#478bdb",
    textColor = "#220047",
    contrastColor = "#220047",
    contrastColor2 = "#FFA497",
    fontFamily = "",
    chartColors = [
      "#220047",
      "#FFA497",
      "#C9DEF4",
      "#DCCFBB",
      "#2ECDAA",
      "#FECAD3",
      "#DDC3FE",
      "#DEF3A2",
      "#B3EEE1",
      "#F490C2",
    ],
    mode = "light",
  } = themeValues;
  // if (themeValues?.chartColor && !themeValues?.chartColors) {
  //     chartColors = generateChartColors(themeValues.chartColor);
  // }
  if (mode === "dark") {
    if (!themeValues?.chartColors) {
      chartColors = [
        "#6883F7",
        "#42E4BC",
        "#FFAD69",
        "#FE6A9C",
        "#7ACFFF",
        "#AA7EF0",
        "#F5E07E",
        "#81D290",
        "#D3C6F7",
        "#018786",
      ];
    }
    if (!themeValues?.textColor) {
      textColor = "#fff";
    }
  }
  return (
    <ThemeContext.Provider
      value={{
        bgMain,
        textColor,
        contrastColor,
        contrastColor2,
        fontFamily,
        chartColors,
        mode,
      }}
    >
      <div
        style={{
          "--minerva-bg-main": bgMain,
          "--minerva-bg-secondary-blue": bgSecondaryBlue,
          "--minerva-bg-secondary-light-blue": bgSecondaryLightBlue,
          // "--minerva-bg-main": bgDark,
          // "--minerva-bg-main": bgLight,
          "--minerva-text-color": textColor,
          "--minerva-contrast-color": contrastColor,
          "--minerva-contrast-color2": contrastColor2,
          "--minerva-font-family": fontFamily,
          "--minerva-border-blue": borderBlue,
          fontFamily: fontFamily,
        }}
        className={`MinervaWC ${
          mode == "light" ? "Minerva-mode-light" : "Minerva-mode-dark"
        }`}
      >
        {children}
        <div id="temp-portal" style={{position: "fixed"}}>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
