import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import MainLayout from "layouts/Main.jsx";
import AdminLayout from "layouts/Admin.jsx";


import "assets/scss/material-dashboard-pro-react.scss?v=1.5.0";
import "assets/scss/storm-react-diagrams.scss?v=1.5.0";
import "assets/scss/react-autosuggest.scss?v=1.5.0";

import { runWithAdal } from "react-adal";
import { authContext } from "./adalConfig";
import { BreadcrumbsProvider } from 'react-breadcrumbs-dynamic';

import * as Sentry from '@sentry/react';
import { fontFamilyConfig, GLOBAL_FONT_FAMILY } from 'util/fontFamilyConfig';



const DO_NOT_LOGIN = false;

const hist = createBrowserHistory();

if (process.env["REACT_APP_ENV"] !== 'development' &&
    process.env["REACT_APP_ENV"] !== 'test' &&
    process.env["REACT_APP_ENABLE_SENTRY"]) {
    Sentry.init({
        dsn: "https://1091c2716f0c8de5c448e7ae6047fe1f@o281602.ingest.sentry.io/5342192",
        environment: process.env["REACT_APP_ENV"]
    });
}

document.querySelector(':root').style.setProperty('--global-font', GLOBAL_FONT_FAMILY);

fontFamilyConfig.forEach((font) => {
  document.fonts.onloadingerror = (e) => {
      console.log("Font loading error",e);
    };
    if (font.source === 'local') {
        font.fontConfigs.forEach((fontConfig) => {
            const newFont = new FontFace(font.fontName, `url(${fontConfig.fontPath})`, {
                weight: fontConfig.fontWeight,
                display: fontConfig.display,
                style: fontConfig.style
            });
            document.fonts.add(newFont);
        });
    }
  //   document.fonts.forEach((x) => {
  //     console.log(x,'font')
  //   })
});

runWithAdal(
  authContext,
  () => {
    ReactDOM.render(
      <BreadcrumbsProvider>
        <Router history={hist}>
          <Switch>
            <Redirect exact from="/admin" to="/admin/projects" />
            <Redirect exact from="/admin/dashboard" to="/admin/projects" />
            <Route path="/admin" component={AdminLayout} />
            <Route path="/dashboard" component={MainLayout} />
            <Route path="/projects" component={MainLayout} />
            <Route exact path="/problem/:industry/:problem" component={MainLayout} />
            <Redirect to="/dashboard" />
          </Switch>
        </Router>
      </BreadcrumbsProvider>,
      document.getElementById("root")
    );
  },
  DO_NOT_LOGIN
);
