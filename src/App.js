import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContentWrapper from './Components/MySnackbarContentWrapper';
import grey from '@material-ui/core/colors/grey';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  buttonHover: {
    margin: theme.spacing.unit * 2,
    color: grey[500],
    '&:hover': {
      color: 'white',
    },
  },
  margin: {
    margin: theme.spacing.unit,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      deviceId: "",
      loggedIn: false,
      error: "",
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      albumArt: "",
      playing: false,
      position: 0,
      duration: 0,
      snackbarOpen: false
    };
    this.playerCheckInterval = null;
  }

  onStateChanged(state) {
    // State is null when music stops
    if (state !== null) {
      const {
        current_track: currentTrack
      } = state.track_window;
      const {
        position,
        duration,
      } = state;
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName: currentTrack.name,
        albumName: currentTrack.album.name,
        albumArt: currentTrack.album.images[0].url,
        artistName: currentTrack.artists
          .map(artist => artist.name)
          .join(", "),
        playing
      });
    }
  }

  handleLogin() {
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
  }

  createEventHandlers() {
    this.player.on('initialization_error', e => {
      console.error(e);
      this.setState({
        snackbarOpen: true,
        snackbarVariant: "error",
        snackbarMessage: "Initialization error"
      });
    });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({
        loggedIn: false,
        snackbarOpen: true,
        snackbarVariant: "error",
        snackbarMessage: "Authentication error"
      });
    });
    this.player.on('account_error', e => {
      console.error(e);
      this.setState({
        snackbarOpen: true,
        snackbarVariant: "error",
        snackbarMessage: "Account error"
      });
    });
    this.player.on('playback_error', e => {
      console.error(e);
      this.setState({
        snackbarOpen: true,
        snackbarVariant: "warning",
        snackbarMessage: "Playback error"
      });
    });

    this.player.on('player_state_changed', state => this.onStateChanged(state));

    this.player.on('ready', async ({ device_id }) => {
      await this.setState({
        deviceId: device_id,
        snackbarOpen: true,
        snackbarVariant: "success",
        snackbarMessage: "Connected!"
      });
      this.transferPlaybackHere();
    });

    this.player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
      this.setState({
        snackbarOpen: true,
        snackbarVariant: "info",
        snackbarMessage: "Device has gone offline"
      });
    });
  }

  checkForPlayer() {
    const { token } = this.state;
    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "React Spotify Player",
        getOAuthToken: cb => { cb(token); },
      });
      this.createEventHandlers();
      this.player.connect();
    }
  }

  onPrevClick() { this.player.previousTrack(); }

  onPlayClick() { this.player.togglePlay(); }

  onNextClick() { this.player.nextTrack(); }

  transferPlaybackHere() {
    const { deviceId, token } = this.state;
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [deviceId],
        "play": true,
      })
    });
  }

  handleClose = (event, reason) => {
    if (reason !== 'clickaway') { this.setState({ snackbarOpen: false }); }
  };

  render() {
    const { classes } = this.props;
    const {
      token,
      loggedIn,
      artistName,
      trackName,
      albumName,
      albumArt,
      error,
      position,
      duration,
      playing,
      snackbarOpen,
      snackbarVariant,
      snackbarMessage
    } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h2>React Spotify Player</h2>

          {error && <p>Error: {error}</p>}

          {loggedIn ?
            (<div>
              <p>Artist: {artistName}</p>
              <p>Track: {trackName}</p>
              <p>Album: {albumName}</p>
              <p>Position: {position}</p>
              <p>Duration: {duration}</p>
              {albumArt && <img src={albumArt} alt="albumArt" />}
              <p>
                <Icon
                  className={classes.buttonHover}
                  color="primary"
                  fontSize="large"
                  onClick={() => this.onPrevClick()}
                >
                  skip_previous
                </Icon>
                <Icon
                  className={classes.buttonHover}
                  color="primary"
                  fontSize="large"
                  onClick={() => this.onPlayClick()}
                >
                  {playing ? 'pause' : 'play_arrow'}
                </Icon>
                <Icon
                  className={classes.buttonHover}
                  color="primary"
                  fontSize="large"
                  onClick={() => this.onNextClick()}
                >
                  skip_next
                </Icon>
              </p>
            </div>)
            :
            (<div>
              <p className="App-intro">
                Enter your Spotify access token. Get it from{" "}
                <a href="https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify">
                  here
                </a>.
              </p>
              <p>
                <input type="text" value={token} onChange={e => this.setState({ token: e.target.value })} />
              </p>
              <p>
                <button onClick={() => this.handleLogin()}>Go</button>
              </p>
            </div>)
          }
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant={snackbarVariant}
            message={snackbarMessage}
          />
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(App);