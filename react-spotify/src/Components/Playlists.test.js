import React from "react";
import { shallow, mount } from "enzyme";
import Playlists from "./Playlists";

describe("playlists", () => {
  it("renders without crashing", () => {
    shallow(<Playlists />);
  });

  it("renders playlists", () => {
    const playlists = [
      { name: "playlist1" },
      { name: "playlist2" },
      { name: "playlist3" },
      { name: "playlist4" },
      { name: "playlist5" }
    ];
    const wrapper = mount(<Playlists playlists={playlists} />);
    const renderedPlaylists = wrapper.find("h5");

    expect(renderedPlaylists.length).toBe(5);
    renderedPlaylists.forEach((playlist, i) => {
      expect(playlist.text()).toBe(playlists[i].name);
    });
  });
});
