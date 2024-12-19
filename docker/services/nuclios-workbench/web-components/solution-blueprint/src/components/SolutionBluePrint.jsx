import ErrorBoundary from "src/components/ErrorBoundary/ErrorBoundary";
import { createGenerateClassName, StylesProvider } from "@material-ui/styles";
import { Provider } from "react-redux";
import store from "src/store/store";
import { GlobalStyleProvider } from "global-style";
import AuthContextProvider from "src/auth/AuthContext";
import PropTypes from "prop-types";
import SolutionBlueprintMain from "./SolutionBlueprintMain";

const generateClassName = createGenerateClassName({
  productionPrefix: "SolutionBluePrint",
  disableGlobal: true,
});

function SolutionBluePrint({ currentTheme }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthContextProvider>
          <StylesProvider generateClassName={generateClassName}>
            <GlobalStyleProvider
              store={store}
              parentCurrentTheme={currentTheme}
            >
              <SolutionBlueprintMain parentCurrentTheme={currentTheme} />
            </GlobalStyleProvider>
          </StylesProvider>
        </AuthContextProvider>
      </Provider>
    </ErrorBoundary>
  );
}

SolutionBluePrint.propTypes = {
  currentTheme: PropTypes.string,
};

export default SolutionBluePrint;
