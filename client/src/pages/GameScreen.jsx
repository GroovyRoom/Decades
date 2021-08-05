import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Canvas from "../components/Canvas";
import {
  Button,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { createTheme } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Game from "../components/Game";

const theme = createTheme({
  palette: {
    text: {
      primary: "#ffffff",
    },
  },
});

const CssTextField = withStyles({
  root: {
    "& label": {
      color: "grey",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& fieldset": {
      borderColor: "white",
    },
  },
})(TextField);

const GameScreen = () => {
  const { id } = useParams();
  const [artworkData, setArtworkData] = useState(null);
  const history = useHistory();

  // use effect runs only once on component startup
  useEffect(() => {
   
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Typography component={"div"} color="textPrimary">
        <Game></Game>
      </Typography>
    </ThemeProvider>
  );
};

export default GameScreen;
