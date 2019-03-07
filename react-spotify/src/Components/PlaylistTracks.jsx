import React from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const styles = {
  root: {
    flexGrow: 1,
    overflow: "auto",
    height: "500px"
  },
  trackPrimary: {
    color: "white"
  },
  trackSecondary: {
    color: "gray"
  }
};

const PlaylistTracks = ({ tracks, classes, onTrackClick }) => {
  return tracks ? (
    <List className={classes.root}>
      {tracks.map(track => (
        <ListItem
          button
          key={`${track.track.name} ${track.track.artists[0].name} ${
            track.track.album.name
          }`}
          onClick={() => onTrackClick(track)}
        >
          <ListItemText
            classes={{
              primary: classes.trackPrimary,
              secondary: classes.trackSecondary
            }}
            primary={track.track.name}
            secondary={`${track.track.artists[0].name} - 
              ${track.track.album.name}`}
          />
        </ListItem>
      ))}
    </List>
  ) : (
    <></>
  );
};

export default withStyles(styles)(PlaylistTracks);
