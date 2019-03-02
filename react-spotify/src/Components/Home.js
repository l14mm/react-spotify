import React, { Component } from 'react';
import '../App.css';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContentWrapper from './MySnackbarContentWrapper';
import grey from '@material-ui/core/colors/grey';
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
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
    card: {
        display: 'flex',
        color: 'black'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    playIcon: {
        height: 38,
        width: 38,
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
                this.setState({ 
                    loggedIn: true, 
                    access_token,
                    snackbarOpen: true,
                    snackbarVariant: "success",
                    snackbarMessage: "Connected!"
                });

                fetch('https://api.spotify.com/v1/me/' + 'player/recently-played', {
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Accept': 'application/json'
                    }
                }).then(response => response.json()).then(json => {
                    const recentlyPlayed = json.items
                    // Start playing the most recently played track
                    this.playTrack(recentlyPlayed[0]);
                })
            }
        }
    }

    playTrack(track) {
        const currentTrack = track.track;
        this.setState({
            position: 0,
            duration: currentTrack.duration_ms,
            trackName: currentTrack.name,
            albumName: currentTrack.album.name,
            albumArt: currentTrack.album.images[0].url,
            artistName: currentTrack.artists
                .map(artist => artist.name)
                .join(", "),
            playing: true
        });
        this.audio = new Audio(currentTrack.preview_url);
        this.audio.play();
        this.timer = setInterval(() => this.setState({ position: this.state.position + 1000 }), 1000);
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

    // onPrevClick() { this.player.previousTrack(); }

    onPlayClick = () => {
        if (this.state.playing) this.audio.pause();
        else this.audio.play()
        const playing = !this.state.playing;
        this.setState({ playing })

        if (playing && !this.timer) {
            // Increase time by 1 second every second
            this.timer = setInterval(() => this.setState({ position: this.state.position + 1000 }), 1000);
        }
        else if (!playing && this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // onNextClick() { this.player.nextTrack(); }

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
                            <Card className={classes.card}>
                                <div className={classes.details}>
                                    <CardContent className={classes.content}>
                                        <Typography component="h5" variant="h5">
                                            {trackName}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            {artistName}
                                        </Typography>
                                    </CardContent>
                                    <div className={classes.controls}>
                                        <IconButton aria-label="Previous" onClick={() => this.onPrevClick()}>
                                            <SkipPreviousIcon />
                                        </IconButton>
                                        <IconButton aria-label="Play/pause" onClick={() => this.onPlayClick()}>
                                            {playing ? <PauseIcon className={classes.playIcon} /> : <PlayArrowIcon className={classes.playIcon} />}
                                        </IconButton>
                                        <IconButton aria-label="Next" onClick={() => this.onNextClick()}>
                                            <SkipNextIcon />
                                        </IconButton>
                                    </div>
                                    <div style={{'display':'flex','flexDirection':'column'}} className={classes.playbackBar}>
                                        <div className={classes.playbackBarTime}>
                                            <p style={{'fontSize':'12px','float':'left','margin':'0 0 0 2px'}}>{currentMinutes}:{currentSecondsStr}</p>
                                            <p style={{'fontSize':'12px','float':'right','margin':'0 2px 0 0'}}>{durationMinutes}:{durationSecondsStr}</p>
                                        </div>
                                        <LinearProgress style={{}} variant="determinate" value={position / duration * 100} />
                                    </div>
                                    <CardMedia
                                        className={classes.cover}
                                        image={albumArt}
                                        title={albumName}
                                    />
                                </div>
                            </Card>
                        </div>)
                        :
                        (<div>
                            <p className="App-intro">
                                Not logged in
                            </p>
                            <p>
                                <input type="text" value={token} onChange={e => this.setState({ token: e.target.value })} />
                            </p>
                            <p>
                                <button onClick={() => this.handleLogin()}>Login</button>
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
                    autoHideDuration={2000}
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