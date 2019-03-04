import React from "react";
import { shallow } from "enzyme";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

beforeEach(() => {
  window.location.href = "/";
  window.location.search = "";
});

it("renders without crashing", () => {
  shallow(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
});
