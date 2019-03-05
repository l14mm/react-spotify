import React from "react";
import { shallow, mount } from "enzyme";
import PlaylistTracks from "./PlaylistTracks";
import { ListItem, ListItemText, Typography } from "@material-ui/core";

describe("playlists", () => {
  it("renders without crashing", () => {
    shallow(<PlaylistTracks />);
  });

  it("renders playlist tracks", () => {
    const tracks = [
      {
        track: {
          name: "track1",
          album: { name: "album1" },
          artists: [{ name: "artist1" }]
        }
      },
      {
        track: {
          name: "track2",
          album: { name: "album2" },
          artists: [{ name: "artist2" }]
        }
      },
      {
        track: {
          name: "track3",
          album: { name: "album3" },
          artists: [{ name: "artist1" }]
        }
      }
    ];
    const wrapper = mount(<PlaylistTracks tracks={tracks} />);
    // const renderedPlaylists = wrapper.find(ListItemText).find("span");

    // console.log(wrapper.debug());
    console.log(
      wrapper
        .find(ListItem)
        .find(ListItemText)
        .find(Typography)
        .find("p")
        .forEach(secondary => console.log(secondary.text()))
    );
    // expect(renderedPlaylists.length).toBe(5);
    // renderedPlaylists.forEach((playlist, i) => {
    //   expect(playlist.text()).toBe(playlists[i].name);
    // });
  });
});
