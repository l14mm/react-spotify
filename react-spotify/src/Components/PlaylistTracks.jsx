import React from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const styles = {
  root: {
    flexGrow: 1
  },
  trackPrimary: {
    color: "white"
  },
  trackSecondary: {
    color: "gray"
  }
};

const PlaylistTracks = ({ tracks, classes }) => {
  return tracks ? (
    <div className={classes.root}>
      <List>
        {tracks.map(track => (
          <ListItem button key={track.track.name + Math.random()}>
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
    </div>
  ) : (
    <></>
  );
};

export default withStyles(styles)(PlaylistTracks);
