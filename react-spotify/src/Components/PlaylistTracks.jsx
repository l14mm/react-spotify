import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const styles = {
  root: {
    flexGrow: 1
  }
};

const PlaylistTracks = ({ tracks, classes }) => {
  return tracks ? (
    <div className={classes.root}>
      {tracks.map(track => (
        <Typography variant="h5" key={track.track.name} color="secondary">
          {track.track.name} - {track.track.artists[0].name} -{" "}
          {track.track.album.name}
        </Typography>
      ))}
    </div>
  ) : (
    <></>
  );
};

export default withStyles(styles)(PlaylistTracks);
