import React from "react";
import { render, waitForElement, fireEvent, cleanup } from "react-testing-library";
import { fetchMock, FetchMock } from "@react-mock/fetch";

import UserGroups from "views/RBAC/UserGroups.jsx";

const user_groups = [
  { id: "1", name: "User Group 1", user_group_type: "SYSTEM", data_prep: true, model_train: true, model_pipelines: true, app_builder: true, rbac: true },
  { id: "2", name: "User Group 2", user_group_type: "USER CREATED", data_prep: false, model_train: false, model_pipelines: false, app_builder: false, rbac: false },
  { id: "3", name: "User Group 3", user_group_type: "SYSTEM", data_prep: false, model_train: false, model_pipelines: false, app_builder: false, rbac: false },
  { id: "4", name: "User Group 4", user_group_type: "USER CREATED", data_prep: true, model_train: true, model_pipelines: true, app_builder: true, rbac: true }
];

const on_add_user_group = {
  id: 5,
  name: "Test Name"
};

const on_update_user_group = {
  status: true
};

const on_delete_user_group = {
  deleted_rows: 1
};

const user_group_1 = {
  id: "1",
  name: "User Group 1",
  user_group_type: "1",
  data_prep: true,
  model_train: true,
  model_pipelines: true,
  app_builder: true,
  rbac: true
};

const list_headers = {
  "X-Total-Count": 4
};

const renderComponent = () =>
  render(
    <FetchMock
      mocks={[
        {
          matcher: "http://localhost/codex-api/user-groups?_end=10&_order=DESC&_sort=id&_start=0",
          method: "GET",
          response: {
            body: user_groups,
            headers: list_headers
          }
        },
        {
          matcher: "http://localhost/codex-api/user-groups",
          method: "POST",
          response: {
            body: on_add_user_group
          }
        },
        {
          matcher: "http://localhost/codex-api/user-groups/1",
          method: "GET",
          response: {
            body: user_group_1
          }
        },
        {
          matcher: "http://localhost/codex-api/user-groups/1",
          method: "PUT",
          response: {
            body: on_update_user_group
          }
        },
        {
          matcher: "http://localhost/codex-api/user-groups/1",
          method: "DELETE",
          response: {
            body: on_delete_user_group
          }
        },
    ]}
    >
      <UserGroups />
    </FetchMock>
  );

describe("User Groups", () => {
  it("renders list", async () => {
    const { debug, getAllByText, getByText } = renderComponent();

    await waitForElement(() => getByText("User Group 1"));

    expect(getAllByText("User Group 1")).toHaveLength(1);

    expect(getAllByText("User Group 2")).toHaveLength(1);

    expect(getAllByText("SYSTEM")).toHaveLength(2);
    expect(getAllByText("USER CREATED")).toHaveLength(2);
  });

  it("renders add", async () => {
    const { debug, getByRole, getByTestId, getByText, getByTitle, getByLabelText, getAllByLabelText, container } = renderComponent();

    await waitForElement(() => getByText("User Group 1"));

    fireEvent.click(getByTitle("Add"));

    await waitForElement(() => getByText("Add User Group"));

    fireEvent.click(getByTitle("Back to list"));

    await waitForElement(() => getByText("User Group 1"));

    fireEvent.click(getByTitle("Add"));

    expect(getAllByLabelText("Name *")).toHaveLength(1);
    expect(getAllByLabelText("Data Prep")).toHaveLength(1);
    expect(getAllByLabelText("Train")).toHaveLength(1);
    expect(getAllByLabelText("Pipelines")).toHaveLength(1);
    expect(getAllByLabelText("Builder")).toHaveLength(1);
    expect(getAllByLabelText("Access")).toHaveLength(1);

    fireEvent.change(getByLabelText("Name *"), { target: { value: "Test Name" }});
    fireEvent.change(getByLabelText("Data Prep"), { target: { checked: true }});
    fireEvent.change(getByLabelText("Train"), { target: { checked: true }});
    fireEvent.change(getByLabelText("Pipelines"), { target: { checked: true }});
    fireEvent.change(getByLabelText("Builder"), { target: { checked: true }});
    fireEvent.change(getByLabelText("Access"), { target: { checked: true }});

    fireEvent.click(getByTestId("form_add_button"));

    await waitForElement(() => getByText("Added successfully !"));

    await waitForElement(() => getByText("User Group 1"));
  });

  it("renders edit", async () => {
    const { debug, getByTestId, getByText, getByLabelText, getByTitle } = renderComponent();

    await waitForElement(() => getByText("User Group 1"));

    fireEvent.click(getByTestId("edit_button_1"));

    await waitForElement(() => getByLabelText("Name *"));

    expect(getByLabelText("Name *").value).toBe("User Group 1");
    expect(getByLabelText("Data Prep").checked).toBe(true);
    expect(getByLabelText("Train").checked).toBe(true);
    expect(getByLabelText("Pipelines").checked).toBe(true);
    expect(getByLabelText("Builder").checked).toBe(true);
    expect(getByLabelText("Access").checked).toBe(true);

    fireEvent.click(getByTestId("form_update_button"));

    await waitForElement(() => getByText("Updated successfully !"));

    await waitForElement(() => getByText("User Group 1"));
  });

  it("renders delete", async () => {
    const { debug, getByTestId, getByText } = renderComponent();

    await waitForElement(() => getByText("User Group 1"));

    fireEvent.click(getByTestId("delete_button_1"));

    await waitForElement(() => getByText("Yes, delete it!"));

    fireEvent.click(getByText("Yes, delete it!"));

    await waitForElement(() => getByText("Deleted successfully !"));

    await waitForElement(() => getByText("User Group 1"));
  });

  afterEach(cleanup);
});
