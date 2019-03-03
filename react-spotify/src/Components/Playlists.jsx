import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";

const styles = {
  root: {
    flexGrow: 1
  }
};

const Playlists = ({ playlists, classes, onPlaylistClick, mode = "list" }) => {
  return playlists ? (
    mode === "list" ? (
      playlists.map(playlist => (
        <Typography
          variant="h5"
          color="primary"
          onClick={() => onPlaylistClick(playlist)}
        >
          {playlist.name}
        </Typography>
      ))
    ) : (
      <div className={classes.root}>
        <Grid container spacing={24}>
          {playlists.map(playlist => (
            <Grid
              item
              xs={4}
              onClick={() => onPlaylistClick(playlist)}
              key={playlist.name}
            >
              <p>{playlist.name}</p>
              <img style={{ width: "100px" }} src={playlist.images[0].url} />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  ) : (
    <></>
  );
};

export default withStyles(styles)(Playlists);
