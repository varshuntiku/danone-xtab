import React from "react";
import { render, waitForElement, fireEvent, cleanup } from "react-testing-library";
import { fetchMock, FetchMock } from "@react-mock/fetch";

import Users from "views/RBAC/Users.jsx";

const users = [
  { id: "1", first_name: "First 1", last_name: "Last 1", email_address: "first.last.1@themathcompany.com", last_login: "2019-04-11 09:00:00", access_key: "accesskey-1", user_groups: [{"id": 1, "name": "default-user"}] },
  { id: "2", first_name: "First 2", last_name: "Last 2", email_address: "first.last.2@themathcompany.com", last_login: "2019-04-12 09:00:00", access_key: "accesskey-2", user_groups: [{"id": 1, "name": "default-user"}, {"id": 2, "name": "super-user"}] },
  { id: "3", first_name: "First 3", last_name: "Last 3", email_address: "first.last.3@themathcompany.com", last_login: "2019-04-13 09:00:00", access_key: "accesskey-3", user_groups: [{"id": 1, "name": "default-user"}] },
  { id: "4", first_name: "First 4", last_name: "Last 4", email_address: "first.last.4@themathcompany.com", last_login: "2019-04-14 09:00:00", access_key: "accesskey-4", user_groups: [{"id": 1, "name": "default-user"}, {"id": 2, "name": "super-user"}] }
];

const user_groups = [
  { id: "1", name: "User Group 1", user_group_type: "SYSTEM", data_prep: true, model_train: true, model_pipelines: true, app_builder: true, rbac: true },
  { id: "2", name: "User Group 2", user_group_type: "USER CREATED", data_prep: false, model_train: false, model_pipelines: false, app_builder: false, rbac: false },
  { id: "3", name: "User Group 3", user_group_type: "SYSTEM", data_prep: false, model_train: false, model_pipelines: false, app_builder: false, rbac: false },
  { id: "4", name: "User Group 4", user_group_type: "USER CREATED", data_prep: true, model_train: true, model_pipelines: true, app_builder: true, rbac: true }
];

const on_add_user = {
  id: 5,
  name: "Test Name"
};

const on_update_user = {
  status: true
};

const on_delete_user = {
  deleted_rows: 1
};

const user_1 = {
  id: "1",
  first_name: "First 1",
  last_name: "Last 1",
  email_address: "first.last.1@themathcompany.com",
  last_login: "2019-04-11 09:00:00",
  access_key: "accesskey-1",
  user_groups: [1]
};

const list_headers = {
  "X-Total-Count": 4
};

const renderComponent = () =>
  render(
    <FetchMock
      mocks={[
        {
          matcher: "http://localhost/codex-api/users?_end=10&_order=DESC&_sort=id&_start=0",
          method: "GET",
          response: {
            body: users,
            headers: list_headers
          }
        },
        {
          matcher: "http://localhost/codex-api/users/user-groups?_end=10&_order=ASC&_sort=name&_start=0",
          method: "GET",
          response: {
            body: user_groups,
            headers: list_headers
          }
        },
        {
          matcher: "http://localhost/codex-api/users",
          method: "POST",
          response: {
            body: on_add_user
          }
        },
        {
          matcher: "http://localhost/codex-api/users/1",
          method: "GET",
          response: {
            body: user_1
          }
        },
        {
          matcher: "http://localhost/codex-api/users/1",
          method: "PUT",
          response: {
            body: on_update_user
          }
        },
        {
          matcher: "http://localhost/codex-api/users/1",
          method: "DELETE",
          response: {
            body: on_delete_user
          }
        },
    ]}
    >
      <Users />
    </FetchMock>
  );

describe("Users", () => {
  it("renders list", async () => {
    const { debug, getAllByText, getByText } = renderComponent();

    await waitForElement(() => getByText("First 1"));

    expect(getAllByText("First 1")).toHaveLength(1);

    expect(getAllByText("First 2")).toHaveLength(1);
  });

  it("renders add", async () => {
    const { debug, getByRole, getByTestId, getByText, getByTitle, getByLabelText, getAllByLabelText, container } = renderComponent();

    await waitForElement(() => getByText("First 1"));

    fireEvent.click(getByTitle("Add"));

    await waitForElement(() => getByText("user-groups - done"));

    await waitForElement(() => getByTitle("Back to list"));

    fireEvent.click(getByTitle("Back to list"));

    await waitForElement(() => getByText("First 1"));

    fireEvent.click(getByTitle("Add"));

    await waitForElement(() => getByText("user-groups - done"));

    await waitForElement(() => getByLabelText("First Name *"));

    expect(getAllByLabelText("First Name *")).toHaveLength(1);
    expect(getAllByLabelText("Last Name *")).toHaveLength(1);
    expect(getAllByLabelText("Email Address *")).toHaveLength(1);
    expect(getAllByLabelText("User Groups")).toHaveLength(1);

    fireEvent.change(getByLabelText("First Name *"), { target: { value: "Test First" }});
    fireEvent.change(getByLabelText("Last Name *"), { target: { value: "Test Last" }});
    fireEvent.change(getByLabelText("Email Address *"), { target: { value: "test@themathcompany.com" }});
    fireEvent.change(getByLabelText("User Groups"), { target: { value: [1,2] }});

    fireEvent.click(getByTestId("form_add_button"));

    await waitForElement(() => getByText("Added successfully !"));

    await waitForElement(() => getByText("First 1"));
  });

  it("renders edit", async () => {
    const { debug, getByTestId, getByText, getAllByLabelText, getByLabelText, getByTitle } = renderComponent();

    await waitForElement(() => getByText("First 1"));

    fireEvent.click(getByTestId("edit_button_1"));

    await waitForElement(() => getByText("Edit User"));

    await waitForElement(() => getByLabelText("First Name *"));

    expect(getAllByLabelText("First Name *")).toHaveLength(1);
    expect(getAllByLabelText("Last Name *")).toHaveLength(1);
    expect(getAllByLabelText("Email Address *")).toHaveLength(1);
    expect(getAllByLabelText("User Groups")).toHaveLength(1);

    fireEvent.click(getByTestId("form_update_button"));

    await waitForElement(() => getByText("Updated successfully !"));

    await waitForElement(() => getByText("First 1"));
  });

  it("renders delete", async () => {
    const { debug, getByTestId, getByText } = renderComponent();

    await waitForElement(() => getByText("First 1"));

    fireEvent.click(getByTestId("delete_button_1"));

    await waitForElement(() => getByText("Yes, delete it!"));

    fireEvent.click(getByText("Yes, delete it!"));

    await waitForElement(() => getByText("Deleted successfully !"));

    await waitForElement(() => getByText("First 1"));
  });

  afterEach(cleanup);
});
