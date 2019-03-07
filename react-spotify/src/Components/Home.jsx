import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import "../App.css";
import Snackbar from "@material-ui/core/Snackbar";
import queryString from "query-string";
import { withStyles } from "@material-ui/core/styles";
import MySnackbarContentWrapper from "./MySnackbarContentWrapper";
import PlaybackBar from "./PlaybackBar";
import * as authActions from "../actions/auth";
import PlaylistTracks from "./PlaylistTracks";
import Sidebar from "./Sidebar";
import Header from "./Header";

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  main: {
    width: "100%",
    display: "flex",
    flexDirection: "column"
  }
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      albumArt: "",
      playing: false,
      position: 0,
      duration: 0,
      snackbarOpen: false
    };
  }

  componentDidMount() {
    const { loggedIn } = this.state;
    const { location } = this.props;

    if (!loggedIn) {
      const accessToken = queryString.parse(location.search).access_token;
      if (!accessToken) {
        // Redirect to server to get spotify token
        window.location.href = "http://localhost:3001";
      } else {
        this.setState({
          loggedIn: true,
          // access_token: accessToken,
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "Connected!"
        });
        this.props.authActions.setAccessToken(accessToken);
        this.props.authActions.userDetails(accessToken);
        this.props.authActions.loadPlaylists(accessToken);

        fetch("https://api.spotify.com/v1/me/player/recently-played", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json"
          }
        })
          .then(response => response.json())
          .then(json => {
            const recentlyPlayed = json.items;
            // Start playing the most recently played track
            this.playTrack(recentlyPlayed[0]);
          });
      }
    }
  }

  onStateChanged(state) {
    // State is null when music stops
    if (state !== null) {
      const { current_track: currentTrack } = state.track_window;
      const { position, duration } = state;
      const playing = !state.paused;
      if (playing && !this.timer) {
        // Increase time by 1 second every second
        this.timer = setInterval(
          () => this.setState({ position: position + 1000 }),
          1000
        );
      } else if (!playing && this.timer) {
        clearInterval(this.timer);
      }
      this.setState({
        position,
        duration,
        trackName: currentTrack.name,
        albumName: currentTrack.album.name,
        albumArt: currentTrack.album.images[0].url,
        artistName: currentTrack.artists.map(artist => artist.name).join(", "),
        playing
      });
    }
  }

  onPrevClick() {
    this.player.previousTrack();
  }

  onPlayClick = () => {
    const { playing, position } = this.state;
    if (playing) this.audio.pause();
    else this.audio.play();
    this.setState({ playing: !playing });

    if (playing && !this.timer) {
      // Increase time by 1 second every second
      this.timer = setInterval(
        () => this.setState({ position: position + 1000 }),
        1000
      );
    } else if (!playing && this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  onNextClick() {
    this.player.nextTrack();
  }

  handleClose = (_, reason) => {
    if (reason !== "clickaway") {
      this.setState({ snackbarOpen: false });
    }
  };

  playTrack(track) {
    const currentTrack = track.track;
    const { position } = this.state;

    if (!currentTrack.preview_url) {
      this.setState({
        loggedIn: true,
        snackbarOpen: true,
        snackbarVariant: "error",
        snackbarMessage: "No track preview available"
      });
      return;
    }

    this.setState({
      position: 0,
      duration: currentTrack.duration_ms,
      trackName: currentTrack.name,
      albumName: currentTrack.album.name,
      albumArt: currentTrack.album.images[0].url,
      artistName: currentTrack.artists.map(artist => artist.name).join(", "),
      playing: true
    });

    this.audio && this.audio.pause();
    this.audio = new Audio(currentTrack.preview_url);
    this.audio.play();

    this.timer = setInterval(
      () => this.setState({ position: position + 1000 }),
      1000
    );
  }

  onPlaylistClick = playlist => {
    this.props.authActions.loadPlaylist(this.props.accessToken, playlist.id);
  };

  onTrackClick = track => {
    this.playTrack(track);
  };

  render() {
    const { playlists, playlist, classes } = this.props;
    const {
      token,
      loggedIn,
      artistName,
      trackName,
      albumName,
      albumArt,
      position,
      duration,
      playing,
      snackbarOpen,
      snackbarVariant,
      snackbarMessage
    } = this.state;
    const dur = Math.floor(duration / 1000);
    const pos = Math.floor(position / 1000);
    const durationMinutes = Math.floor(dur / 60);
    const durationSeconds = dur - durationMinutes * 60;
    const durationSecondsStr =
      durationSeconds < 10 ? `0${durationSeconds}` : `${durationSeconds}`;
    const currentMinutes = Math.floor(pos / 60);
    const currentSeconds = pos - currentMinutes * 60;
    const currentSecondsStr =
      currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds;
    return (
      <div className="App-main">
        {loggedIn ? (
          <>
            <Sidebar
              playlists={playlists}
              onPlaylistClick={this.onPlaylistClick}
            />
            <Header />
            <div className={classes.main}>
              <div className={classes.toolbar} />
              <PlaylistTracks
                tracks={playlist}
                onTrackClick={this.onTrackClick}
              />
              <PlaybackBar
                trackName={trackName}
                playing={playing}
                currentMinutes={currentMinutes}
                currentSecondsStr={currentSecondsStr}
                durationMinutes={durationMinutes}
                durationSecondsStr={durationSecondsStr}
                artistName={artistName}
                albumArt={albumArt}
                albumName={albumName}
                position={position}
                duration={duration}
                onPrevClick={this.onPrevClick}
                onPlayClick={this.onPlayClick}
                onNextClick={this.onNextClick}
              />
            </div>
          </>
        ) : (
          <div>
            <p className="App-intro">Not logged in</p>
            <p>
              <input
                type="text"
                value={token}
                onChange={e => this.setState({ token: e.target.value })}
              />
            </p>
            <p>
              <button type="button" onClick={() => this.handleLogin()}>
                Login
              </button>
            </p>
          </div>
        )}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant={snackbarVariant}
            message={snackbarMessage}
            className={snackbarVariant}
          />
        </Snackbar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userDetails: state.userDetails,
    accessToken: state.accessToken,
    playlists: state.playlists,
    playlist: state.playlist
  };
};

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch)
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Home);
