import React from "react";
import { shallow, mount } from "enzyme";
import Sidebar from "./Sidebar";
import { ListItemText } from "@material-ui/core";

describe("playlists", () => {
  it("renders without crashing", () => {
    shallow(<Sidebar />);
  });

  it("renders sidebar", () => {
    const playlists = [
      { name: "playlist1" },
      { name: "playlist2" },
      { name: "playlist3" },
      { name: "playlist4" },
      { name: "playlist5" }
    ];
    const wrapper = mount(<Sidebar playlists={playlists} />);
    const renderedPlaylists = wrapper.find(ListItemText).find("span");

    expect(renderedPlaylists.length).toBe(5);
    renderedPlaylists.forEach((playlist, i) => {
      expect(playlist.text()).toBe(playlists[i].name);
    });
  });
});
