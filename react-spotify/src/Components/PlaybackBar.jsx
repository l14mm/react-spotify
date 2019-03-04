import React from "react";
import grey from "@material-ui/core/colors/grey";
import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  buttonHover: {
    margin: theme.spacing.unit * 2,
    color: grey[500],
    "&:hover": {
      color: "white"
    }
  },
  margin: {
    margin: theme.spacing.unit
  },
  card: {
    display: "flex",
    color: "black"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: 151
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  playIcon: {
    height: 38,
    width: 38
  },
  playbackBar: {
    display: "flex",
    flexDirection: "column"
  },
  playbackBarCurrentTime: {
    fontSize: "12px",
    float: "left",
    margin: "0 0 0 2px"
  },
  playbackBarTotalTime: {
    fontSize: "12px",
    float: "right",
    margin: "0 2px 0 0"
  }
});

const PlaybackBar = ({
  classes,
  trackName,
  playing,
  currentMinutes,
  currentSecondsStr,
  durationMinutes,
  durationSecondsStr,
  artistName,
  albumArt,
  albumName,
  position,
  duration,
  onPrevClick,
  onPlayClick,
  onNextClick
}) => {
  return (
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
          <IconButton aria-label="Previous" onClick={() => onPrevClick()}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton aria-label="Play/pause" onClick={() => onPlayClick()}>
            {playing ? (
              <PauseIcon className={classes.playIcon} />
            ) : (
              <PlayArrowIcon className={classes.playIcon} />
            )}
          </IconButton>
          <IconButton aria-label="Next" onClick={() => onNextClick()}>
            <SkipNextIcon />
          </IconButton>
        </div>
        <div className={classes.playbackBar}>
          <div className={classes.playbackBarTime}>
            <p className={classes.playbackBarCurrentTime}>
              {currentMinutes}:{currentSecondsStr}
            </p>
            <p className={classes.playbackBarTotalTime}>
              {durationMinutes}:{durationSecondsStr}
            </p>
          </div>
          <LinearProgress
            variant="determinate"
            value={(position / duration) * 100}
          />
        </div>
      </div>
      <CardMedia className={classes.cover} image={albumArt} title={albumName} />
    </Card>
  );
};

PlaybackBar.propTypes = {
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    controls: PropTypes.string.isRequired,
    playIcon: PropTypes.string.isRequired,
    playbackBar: PropTypes.string,
    playbackBarTime: PropTypes.string
  }).isRequired,
  trackName: PropTypes.string.isRequired,
  playing: PropTypes.bool.isRequired,
  currentMinutes: PropTypes.number.isRequired,
  currentSecondsStr: PropTypes.string.isRequired,
  durationMinutes: PropTypes.number.isRequired,
  durationSecondsStr: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  albumArt: PropTypes.string.isRequired,
  albumName: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  onPrevClick: PropTypes.func.isRequired,
  onPlayClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired
};

export default withStyles(styles)(PlaybackBar);
