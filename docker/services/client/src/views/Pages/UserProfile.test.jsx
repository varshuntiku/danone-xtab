import React from "react";
import { render, waitForElement } from "react-testing-library";
import { FetchMock } from "@react-mock/fetch";

import UserProfile from "./UserProfile.jsx";

const user_info = {
  username: "test@themathcompany.com",
  first_name: "First name",
  last_name: "Last name",
  access_key: "mlflowaccesskey"
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
      <UserProfile />
    </FetchMock>
  );

  it("renders user profile", async () => {
    // Render new instance in every test to prevent leaking state
    const { getByLabelText, getByValue } = renderComponent();

    // It takes time because the GET request has a slight delay
    await waitForElement(() => getByValue(user_info.username));

    expect(getByLabelText("Username").value).toBe(user_info.username);
    expect(getByLabelText("Email address").value).toBe(user_info.username);
    expect(getByLabelText("First Name").value).toBe(user_info.first_name);
    expect(getByLabelText("Last Name").value).toBe(user_info.last_name);
  });
