import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom"
import Canvas from "../components/Canvas";
import { Button, TextField, ThemeProvider, Typography } from "@material-ui/core";
import { createTheme } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SoundCloud from "../components/SoundCloud"
import { makeStyles } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    text:{
      primary: "#ffffff"
    }
  }
});

const useStyles = makeStyles({
  rootHolder: {
    minWidth: 260,
    maxWidth: 330,
    margin: "0 auto",
    padding: "50px 50px",
    boxSizing: "border-box",
    borderStyle:'solid',
    borderWidth:'0.3px',
    borderColor:'#66FCA6',
  },
  playbutton: {
    width: "80px",
    height: "80px",
    padding: "20px 25px",
    margin: "10px 10px 10px 0px",
    "background-color": "#66FCA6",
    border: "none",
    color: "rgb(10, 31, 27)",
    "font-size": "1.6em"
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
    "font-size": "1.6em"
  }
});

const CssTextField = withStyles({
  root: {
    '& label': {
      color: 'grey',
    },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& fieldset': {
      borderColor: 'white',
    }
  },
})(TextField);

const ViewingScreen = () => {
  const classes = useStyles();

  const { id } = useParams();
  const [artworkData, setArtworkData] = useState(null)
  const [toggle, setToggle] = useState(-1);

  // use effect runs only once on component startup
  useEffect(() => {
    fetch(`/api/debug/${id}`)
      .then(response => response.json())
      .then(result => {
        setArtworkData(result)
      })
    
  }, [])

  if (artworkData == null){
    return <ThemeProvider theme={theme}><Typography component={'div'} color="textPrimary"><div>Loading, please wait...</div></Typography></ThemeProvider>
  } else {
    return <ThemeProvider theme={theme}><Typography component={'fieldset'} color="textPrimary"><div>
      <Canvas bitmap={artworkData.bitmap} disallowDraw={true}></Canvas>
      <p>{`Artwork: ${artworkData.meta.name} by ${artworkData.meta.user}`}</p>
      <p>{`Music: ${artworkData.meta.songId}`}</p>
      <div className={classes.rootHolder}>
        <SoundCloud
            url={`https://soundcloud.com/${artworkData.meta.songId}`}
            status={toggle}
        />
        <button className={classes.playbutton} onClick={() => {
            setToggle(1)
          }
        }>▶</button>
        <button className={classes.pauseButton} onClick={() => {
            setToggle(0)
          }
        }>❚❚</button>
    </div>
      </div></Typography></ThemeProvider>
  }
};

export default ViewingScreen;