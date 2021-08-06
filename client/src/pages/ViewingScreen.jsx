import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Canvas from "../components/Canvas";
import {
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
  Card,
  CardActions,
} from "@material-ui/core";
import SoundCloud from "../components/SoundCloud";
import { makeStyles } from "@material-ui/core/styles";
import Game from "../components/Game";
import Pako from "pako";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";

const useStyles = makeStyles(({ spacing, palette }) => ({
  rootHolder: {
    minWidth: 260,
    maxWidth: 330,
    margin: "0 auto",
    padding: "50px 50px",
    boxSizing: "border-box",
    borderStyle: "solid",
    borderWidth: "0.3px",
    borderColor: "#66FCA6",
  },
  playbutton: {
    width: "80px",
    height: "80px",
    padding: "20px 25px",
    margin: "10px 10px 10px 0px",
    "background-color": "#66FCA6",
    border: "none",
    color: "rgb(10, 31, 27)",
    "font-size": "1.6em",
  },
  pauseButton: {
    width: "80px",
    height: "80px",
    padding: "20px 25px",
    margin: "10px 0px 10px 10px",
    float: "right",
    "background-color": "#66FCA6",
    border: "none",
    color: "rgb(10, 31, 27)",
    "font-size": "1.6em",
  },
  loading: {
    color: "#fff",
    display: "flex",
    justifyContent: "center",
  },
  canvas: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#0A1F1B",
    margin: spacing(2),
  },
  textArtworkField: {
    display: "flex",
    justifyContent: "center",
    color: "#66FCA6",
  },
  buttonInfo: {
    margin: spacing(2),
  },
  cardInfo: {
    maxWidth: 300,
    backgroundColor: "#0A1F1B",
    marginLeft: "38%",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewingScreen = () => {
  const classes = useStyles();

  const { id } = useParams();
  const [artworkData, setArtworkData] = useState(null);
  const [toggle, setToggle] = useState(-1); //set to -1
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // use effect runs only once on component startup
  useEffect(() => {
    fetch(`/api/artworks/${id}`)
      .then((response) => response.json())
      .then((result) => {
        result.bitmap = null;
        if (result.meta.bitmap !== null) {
          result.bitmap = Pako.inflate(result.meta.bitmap);
        }
        setArtworkData(result);
      });
  }, []);

  if (artworkData == null) {
    return (
      <div className={classes.loading}>
        <h2>Loading, please wait...</h2>
      </div>
    );
  } else {
    return (
      <div>
        <Paper className={classes.canvas}>
          <div id="game_background">
            <Canvas bitmap={artworkData.bitmap} disallowDraw={true}></Canvas>
            <Game></Game>
          </div>
        </Paper>
        <Card className={classes.cardInfo}>
          <CardActions>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
              className={classes.buttonInfo}
            >
              Artwork Info
            </Button>
            <SoundCloud
              url={`https://soundcloud.com/${artworkData.meta.songId}`}
              status={toggle}
            />
            <IconButton
              onClick={() => {
                setToggle(1);
              }}
              color="primary"
            >
              <PlayCircleOutlineIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setToggle(0);
              }}
              color="primary"
            >
              <PauseCircleOutlineIcon />
            </IconButton>
          </CardActions>
        </Card>

        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{`Artwork: ${artworkData.meta.name}`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography>Created by user: ${artworkData.meta.user}</Typography>
              <Typography>Music: ${artworkData.meta.songId}</Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="#000">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
};

export default ViewingScreen;
