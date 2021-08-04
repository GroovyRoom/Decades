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

const _save = (id, history, isPublic = false) => {
  //TODO: well, we could just find canvas on the page and get its frame data... dirty, but could work

  const canvas = document.getElementsByTagName("canvas")[0];
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, 640, 640);

  let bitmap = [];
  for (let i = 0; i < 640 * 640 * 4; i += 4) {
    // Just RGB, no alpha
    bitmap.push(imageData.data[i]);
    bitmap.push(imageData.data[i + 1]);
    bitmap.push(imageData.data[i + 2]);
  }

  let requestData = { meta: {}, bitmap: [] };
  requestData.meta.name = document.getElementById("name_field").value;
  requestData.meta.songId = document.getElementById("song_field").value;
  if (id !== "new") {
    requestData.meta.id = id;
  }

  requestData.meta.public = isPublic

  requestData.bitmap = bitmap;

  console.log(requestData);

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  };

  fetch(`/api/artworks/save`, requestOptions)
    .then((response) => response.json())
    .then((response) => history.push(`/editor/${response.id}`));
};

const EditorScreen = () => {
  const { id } = useParams();
  const [artworkData, setArtworkData] = useState(null);
  const history = useHistory();

  // use effect runs only once on component startup
  useEffect(() => {
    if (id === "new") {
      let freshArtwork = { meta: {}, bitmap: null };
      freshArtwork.meta.name = "Unnamed";
      freshArtwork.meta.songId = "bringerss/beneath-the-mask-rain-extended";
      setArtworkData(freshArtwork);
    } else {
      fetch(`/api/debug/${id}`)
        .then((response) => response.json())
        .then((result) => {
          setArtworkData(result);
        });
    }
  }, []);

  if (artworkData == null) {
    return (
      <ThemeProvider theme={theme}>
        <Typography component={"div"} color="textPrimary">
          <div>Loading, please wait...</div>
        </Typography>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <Typography component={"fieldset"} color="textPrimary">
          <div>
            <Canvas bitmap={artworkData.bitmap}></Canvas>
            <CssTextField
              id="name_field"
              label="Name"
              variant="outlined"
              defaultValue={artworkData.meta.name}
            ></CssTextField>
            <CssTextField
              id="song_field"
              label="Song"
              variant="outlined"
              defaultValue={artworkData.meta.songId}
            ></CssTextField>
            <Button variant="contained" onClick={() => {
              _save(id, history, false)
            }}>
              Save
            </Button>
            <Button variant="contained" onClick={() => {
              _save(id, history, true)
            }}>
              Upload
            </Button>
          </div>
        </Typography>
      </ThemeProvider>
    );
  }
};

export default EditorScreen;
