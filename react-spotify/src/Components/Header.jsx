import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const drawerWidth = 200;

const styles = theme => ({
  header: {
    backgroundColor: "#282c34",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",

    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  title: { flexGrow: 1 },
  toolbar: { width: "95%" }
});

const Header = ({ classes, userDetails }) => {
  return (
    <AppBar color="primary" position="fixed" className={classes.header}>
      <Toolbar variant="dense" className={classes.toolbar}>
        <Typography variant="h5" color="inherit" className={classes.title}>
          React Spotify Player
        </Typography>
        {userDetails && (
          <Typography variant="h6" color="inherit">
            Welcome {userDetails.display_name}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = state => {
  return {
    userDetails: state.userDetails
  };
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles)
)(Header);
