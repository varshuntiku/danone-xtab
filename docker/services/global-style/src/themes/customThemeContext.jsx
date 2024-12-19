import { ThemeProvider } from "@material-ui/styles";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { getAllAppThemes } from "src/services/theme";
import themeGenerator from "./themeGenerator/themeGenerator";
import defaultTheme from "./themeData/default";
import { AuthContext } from "src/auth/AuthContext";
import PropTypes from "prop-types";

const getThemeObject = (themeData) => {
  return {
    name: themeData.name,
    id: themeData.id,
    readOnly: themeData.readonly,
    modes: themeData.modes.map((el) => {
      const { materialTheme, chartTheme } = themeGenerator(
        el.bg_variant,
        el.mode,
        el.contrast_color,
        el.chart_colors,
        el.params
      );
      return {
        mode: el.mode,
        bg_variant: el.bg_variant,
        contrast_color: el.contrast_color,
        chart_colors: el.chart_colors,
        params: el.params,
        materialTheme,
        chartTheme,
      };
    }),
  };
};

export const CustomThemeContext = React.createContext({
  theme: null,
  plotTheme: null,
  themeMode: "",
  themeId: null,
  bg_variant: 0,
  themeLoadCount: -0,
  changeTheme: () => {},
  getTheme: () => {},
  refreshAppThemes: () => {},
  Themes: [],
});

function getThemeData(Themes, themeMode, themeId) {
  const theme = Themes.find((el) => el.id === themeId) || Themes[0];
  const themeModeData =
    theme?.modes.find((el) => el.mode === themeMode) || Themes[0].modes[0];
  return {
    theme: themeModeData.materialTheme,
    plotTheme: themeModeData.chartTheme,
    themeMode: themeModeData.mode,
    themeId: theme.id,
    bg_variant: themeModeData.bg_variant,
  };
}

export default function CustomThemeContextProvider({
  children,
  parentCurrentTheme,
}) {
  const [Themes, setThemes] = useState([getThemeObject(defaultTheme)]);
  const [themeData, setThemeData] = useState(
    getThemeData(
      Themes,
      localStorage.getItem("codx-products-theme"),
      localStorage.getItem("codx-customer-theme")
    )
  );
  const [askedThemeId, setAskedThemeId] = useState(
    localStorage.getItem("codx-customer-theme")
  );
  const [askedThemeMode, setAskedThemeMode] = useState(
    localStorage.getItem("codx-products-theme")
  );
  const { theme, themeMode, themeId, plotTheme, bg_variant } = themeData;
  const { user } = useContext(AuthContext);
  const [themeLoadCount, setThemeLoadCount] = useState(0);

  useEffect(() => {
    if (user) {
      getAllAppThemes()
        .then((themes) => {
          setThemes(() => [
            getThemeObject(defaultTheme),
            ...themes.map((el) => getThemeObject(el)),
          ]);
          setThemeLoadCount((s) => s + 1);
        })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (parentCurrentTheme) {
      setAskedThemeMode(parentCurrentTheme);
      setThemeData(getThemeData(Themes, parentCurrentTheme, askedThemeId));
    }
  }, [parentCurrentTheme, Themes, askedThemeId]);

  useEffect(() => {
    setThemeData(getThemeData(Themes, askedThemeMode, askedThemeId));
  }, [askedThemeId, askedThemeMode, Themes]);

  const refreshAppThemes = useCallback(() => {
    getAllAppThemes()
      .then((themes) => {
        setThemes(() => [
          getThemeObject(defaultTheme),
          ...themes.map((el) => getThemeObject(el)),
        ]);
        setThemeLoadCount((s) => s + 1);
      })
      .catch(() => {});
  }, []);

  const changeTheme = useCallback(
    (_themeMode = themeMode, _themeId = themeId) => {
      localStorage.setItem("codx-products-theme", _themeMode);
      localStorage.setItem("codx-customer-theme", _themeId);
      setAskedThemeId(_themeId);
      setAskedThemeMode(_themeMode);
    },
    [Themes, themeId, themeMode]
  );

  const getTheme = useCallback(
    (themeMode, themeId) => {
      return getThemeData(Themes, themeMode, themeId);
    },
    [Themes]
  );

  return (
    <CustomThemeContext.Provider
      value={{
        theme,
        themeMode,
        themeId,
        changeTheme,
        plotTheme,
        getTheme,
        bg_variant,
        Themes,
        refreshAppThemes,
        themeLoadCount,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
}

CustomThemeContextProvider.propTypes = {
  children: PropTypes.any,
  parentCurrentTheme: PropTypes.string,
};

export function withThemeContext(Component, propsName = "themeContext") {
  return function WrapperComponent(props) {
    return (
      <CustomThemeContext.Consumer>
        {(state) => <Component {...props} {...{ [propsName]: state }} />}
      </CustomThemeContext.Consumer>
    );
  };
}
