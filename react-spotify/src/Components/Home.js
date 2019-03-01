import React, { Component } from 'react';
import '../App.css';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContentWrapper from './MySnackbarContentWrapper';
import grey from '@material-ui/core/colors/grey';
import Icon from '@material-ui/core/Icon';
import LinearProgress from '@material-ui/core/LinearProgress';
import queryString from 'query-string';
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

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceId: "",
            loggedIn: false,
            trackName: "Track Name",
            artistName: "Artist Name",
            albumName: "Album Name",
            albumArt: "",
            playing: false,
            position: 0,
            duration: 0,
            snackbarOpen: false,
            access_token: null
        };
        this.playerCheckInterval = null;
    }

    componentDidMount() {
        if (!this.state.loggedIn) {
            const access_token = queryString.parse(this.props.location.search).access_token;
            if (!access_token) {
                // Redirect to server to get spotify token
                window.location.href = 'http://localhost:3001';
            }
            else {
                this.setState({ loggedIn: true, access_token });
                this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
            }
        }
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
            if (playing && !this.timer) {
                // Increase time by 1 second every second
                this.timer = setInterval(() => this.setState({ position: this.state.position + 1000 }), 1000);
            }
            else if (!playing && this.timer) {
                clearInterval(this.timer);
            }
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
        const { access_token } = this.state;
        if (window.Spotify !== null) {
            clearInterval(this.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: "React Spotify Player",
                getOAuthToken: cb => { cb(access_token); },
            });
            this.createEventHandlers();
            this.player.connect();
        }
    }

    onPrevClick() { this.player.previousTrack(); }

    onPlayClick() { this.player.togglePlay(); }

    onNextClick() { this.player.nextTrack(); }

    transferPlaybackHere() {
        const { deviceId, access_token } = this.state;
        fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
                authorization: `Bearer ${access_token}`,
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
            position,
            duration,
            playing,
            snackbarOpen,
            snackbarVariant,
            snackbarMessage
        } = this.state;
        const dur = Math.floor(duration / 1000)
        const pos = Math.floor(position / 1000)
        var durationMinutes = Math.floor(dur / 60);
        var durationSeconds = dur - durationMinutes * 60;
        var durationSecondsStr = durationSeconds < 10 ? '0' + durationSeconds : durationSeconds;
        var currentMinutes = Math.floor(pos / 60);
        var currentSeconds = pos - currentMinutes * 60;
        var currentSecondsStr = currentSeconds < 10 ? '0' + currentSeconds : currentSeconds;
        return (
            <div className="App">
                <div className="App-header">
                    <h2>React Spotify Player</h2>
                    {loggedIn ?
                        (<div>
                            <p>Artist: {artistName}</p>
                            <p>Track: {trackName}</p>
                            <p>Album: {albumName}</p>
                            <p>Position: {currentMinutes}:{currentSecondsStr}</p>
                            <p>Duration: {durationMinutes}:{durationSecondsStr}</p>
                            <LinearProgress variant="determinate" value={position / duration * 100} />
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

export default withStyles(styles)(Home);