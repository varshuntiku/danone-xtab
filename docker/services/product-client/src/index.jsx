import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { BreadcrumbsProvider } from 'react-breadcrumbs-dynamic';
import Home from 'components/Home/Home.jsx';
import './index.css';
import 'assets/scss/storm-react-diagrams.scss?v=1.5.0';
import 'assets/scss/react-plotly.scss?v=1.5.0';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from './themes/customThemeContext';
import PreviewPublishedStory from './components/previewPublishedStory/PreviewPublishedStory';
import PlotlyLoader from 'components/PlotlyLoader';

import * as Sentry from '@sentry/react';
import AuthContextProvider from './auth/AuthContext';

const initTracker = async () => {
    if (
        import.meta.env['REACT_APP_ENV'] !== 'development' &&
        import.meta.env['REACT_APP_ENV'] !== 'test'
    ) {
        if (import.meta.env['REACT_APP_ENABLE_SENTRY']) {
            Sentry.init({
                dsn: 'https://1091c2716f0c8de5c448e7ae6047fe1f@o281602.ingest.sentry.io/5342192',
                environment: import.meta.env['REACT_APP_ENV']
            });
        }
        if (import.meta.env['REACT_APP_ENABLE_APP_INSIGHTS']) {
            // import appInsightsLogger
            const { appInsights } = await import('./util/appInsightsLogger');

            // initialize Azure Application Insights
            appInsights.trackPageView();
        }
    }
};

initTracker();

const initLogger = (enableLogging) => {
    if (enableLogging) {
        window.console = {
            log: window.console.log.bind(window.console),
            error: window.console.error.bind(window.console),
            info: window.console.info.bind(window.console),
            warn: window.console.warn.bind(window.console)
        };
    } else {
        const __nooP__ = function () {};

        window.console = {
            log: __nooP__,
            error: __nooP__,
            warn: __nooP__,
            info: __nooP__
        };
    }
};

const enableLogging = () => {
    if (import.meta.env['REACT_APP_ENV'] === 'prod' || import.meta.env['REACT_APP_ENV'] === 'uat') {
        return false;
    } else {
        return true;
    }
};

initLogger(enableLogging());

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <AuthContextProvider method="msal">
            <CustomThemeContextProvider>
                <BreadcrumbsProvider>
                    <PlotlyLoader>
                        <BrowserRouter>
                            <Switch>
                                <Route
                                    exact
                                    path="/preview-published-story"
                                    component={(props) => <PreviewPublishedStory {...props} />}
                                />
                                <Route path="/" component={(props) => <Home {...props} />} />
                            </Switch>
                        </BrowserRouter>
                    </PlotlyLoader>
                </BreadcrumbsProvider>
            </CustomThemeContextProvider>
        </AuthContextProvider>
    </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
