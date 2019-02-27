import React, { Component } from 'react';
import './App.css';

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
    };
    this.playerCheckInterval = null;
  }

  onStateChanged(state) {
    // State is null when music stops
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      console.log(currentTrack)
      const albumArt = currentTrack.album.images[0].url;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        albumArt,
        artistName,
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
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });

    this.player.on('player_state_changed', state => this.onStateChanged(state));

    this.player.on('ready', async ({ device_id }) => {
      console.log("Let the music play on!");
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
    });

    this.player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
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

  render() {
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
              {albumArt && <img src={albumArt} alt="albumArt" />}
              <p>
                <button onClick={() => this.onPrevClick()}>Previous</button>
                <button onClick={() => this.onPlayClick()}>{playing ? "Pause" : "Play"}</button>
                <button onClick={() => this.onNextClick()}>Next</button>
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
      </div>
    );
  }
}

export default App;
