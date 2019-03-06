import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core";

const drawerWidth = 200;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.main
  },
  toolbar: theme.mixins.toolbar,
  primaryText: { color: theme.palette.secondary.main }
});

const Sidebar = ({ classes, playlists, onPlaylistClick }) => {
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper
      }}
      anchor="left"
    >
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {playlists &&
          playlists.map(playlist => (
            <ListItem
              button
              key={playlist.name}
              onClick={() => onPlaylistClick(playlist)}
            >
              <ListItemText
                classes={{ primary: classes.primaryText }}
                primary={playlist.name}
              />
            </ListItem>
          ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default withStyles(styles)(Sidebar);
