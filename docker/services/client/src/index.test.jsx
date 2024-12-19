import React from "react";
import { render, waitForElement } from "react-testing-library";
import { FetchMock } from "@react-mock/fetch";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import { createBrowserHistory } from "history";

import AuthLayout from "layouts/Auth.jsx";
import RtlLayout from "layouts/RTL.jsx";
import AdminLayout from "./layouts/Admin.jsx";

const hist = createBrowserHistory();

window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
});

const user_info = {
  username: "test@themathcompany.com",
  first_name: "First name",
  last_name: "Last name",
  access_key: "mlflowaccesskey",
  feature_access: {
    data_prep: true,
    model_train: true,
    model_pipelines: true,
    app_builder: true,
    rbac: true
  }
};

const renderComponent = () =>
  render(
    <FetchMock
      mocks={[
        {
          matcher: "http://localhost/codex-api/user/get-info",
          method: "GET",
          response: user_info
        }
    ]}
    >
      <Router history={hist}>
        <Switch>
          <Route path="/rtl" component={RtlLayout} />
          <Route path="/auth" component={AuthLayout} />
          <Route path="/admin" component={AdminLayout} />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </Router>
    </FetchMock>
  );

  it("renders codex dashboard", async () => {
    // Render new instance in every test to prevent leaking state
    const { getByText } = renderComponent();

    // It takes time because the GET request has a slight delay
    await waitForElement(() => getByText("Data Sources online"));
  });
