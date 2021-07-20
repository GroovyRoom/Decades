import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SoundCloud from "../components/SoundCloud"

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


const MusicScreen = () => {
  const classes = useStyles();
  const [toggle, setToggle] = useState(-1);

  return (
      <div className={classes.rootHolder}>
        <SoundCloud
            url={"https://soundcloud.com/otiskane/perfect"}
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
  );
};

export default MusicScreen;