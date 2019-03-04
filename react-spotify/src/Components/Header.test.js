import React from "react";
import { shallow, mount } from "enzyme";
import { Typography } from "@material-ui/core";
import { Provider } from "react-redux";
import Header from "./Header";
import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore();

describe("header", () => {
  it("renders without crashing", () => {
    shallow(<Header />);
  });

  it("renders with the users' name", () => {
    const displayName = "myUsername";
    const store = mockStore({ userDetails: { display_name: displayName } });

    const header = mount(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(header.find(Typography)).toHaveLength(2);
    expect(
      header
        .find(Typography)
        .at(1)
        .find("h6")
        .text()
    ).toBe(displayName);
  });
});
