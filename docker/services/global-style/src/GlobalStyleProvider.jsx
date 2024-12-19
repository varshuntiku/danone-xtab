import React from "react";
import CustomThemeContextProvider from "./themes/customThemeContext";
import { Provider } from "react-redux";
import AuthContextProvider from "src/auth/AuthContext";
import PropTypes from "prop-types";

function GlobalStyleProvider({ store, parentCurrentTheme, children }) {
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <CustomThemeContextProvider parentCurrentTheme={parentCurrentTheme}>
          {children}
        </CustomThemeContextProvider>
      </AuthContextProvider>
    </Provider>
  );
}

GlobalStyleProvider.propTypes = {
  children: PropTypes.any,
  store: PropTypes.object,
  parentCurrentTheme: PropTypes.string,
};

export default GlobalStyleProvider;
