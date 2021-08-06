import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Canvas from "../components/Canvas";
import {
  Button,
  TextField,
  ThemeProvider,
  Typography,
  Slider,
  Container,
  Box
} from "@material-ui/core";
import { createTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { ChromePicker, SketchPicker } from 'react-color';
import Pako from 'pako'

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

const _save = (id, history, uploadingStateSetter, isPublic = false) => {
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
    bitmap.push(imageData.data[i + 3]);
  }

  let requestData = { meta: {}, bitmap: [] };
  requestData.meta.name = document.getElementById("name_field").value;
  requestData.meta.songId = document.getElementById("song_field").value;
  if (id !== "new") {
    requestData.meta.id = id;
  }

  if (isPublic) {
    requestData.meta.public = true;
  }


  requestData.meta.bitmap = Pako.deflate(bitmap, { to: 'string' });

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  };

  uploadingStateSetter(1)

  fetch(`/api/artworks/save`, requestOptions)
    .then((response) => response.json())
    .then((response) => {
      uploadingStateSetter(2)
      history.push(`/editor/${response.id}`)
    });
};

const useStyles = makeStyles({
  body: {
    marginTop: 50,
    marginLeft: 100,
    marginRight: 100,
    display: 'flex',
    justifyContent: 'space-around',
  },

  tools: {
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'space-between',
  },

  colors: {
    display: 'flex',
    justifyContent: 'center'
  },

  buttons: {
    display: 'flex',
    justifyContent: 'space-around'
  },

  text: {
    color: 'white'
  },

  readyStatusText: {
    color: 'white',
    marginLeft: 50
  },

  uploadingStatusText: {
    color: '#C3F4FD',
    marginLeft: 50
  },

  uploadedStatusText: {
    color: '#91F8AD',
    marginLeft: 50
  },

  button: {
    backgroundColor: '#B7F6FF',
    borderRadius: 36,
    fontSize: 24,
    maxWidth: 160,
    padding: '14px 160px',
    "&:hover": {
      backgroundColor: '#B7F6FF',
      boxShadow: '0 8px 16px 0 #626262, 0 6px 20px 0 #626262'
    }
  },

  field: {
    background: '#0A1F1B',
  },

  label: {
    background: '#0A1F1B',
    color: 'white',
  },

  name: {
    border: '2px solid white',
    background: '#0A1F1B',
    color: 'white',
  },

  loading: { 
    color: '#fff',
    display: 'flex',
    justifyContent: 'center'
  }
})

const EditorScreen = () => {
  const { id } = useParams();
  const [artworkData, setArtworkData] = useState(null);
  const [drawThickness, setDrawThickness] = useState(8)
  const [drawColor, setDrawColor] = useState({ r: 0, g: 0, b: 255, a: 255 })
  const history = useHistory();
  const classes = useStyles();

  // 0 - fresh, 1 - uploading, 2 - successfully uploaded
  const [uploadingState, setUploadingState] = useState(0)

  // use effect runs only once on component startup
  useEffect(() => {
    if (id === "new") {
      let freshArtwork = { meta: {}, bitmap: null };
      freshArtwork.meta.name = "Unnamed";
      freshArtwork.meta.songId = "bringerss/beneath-the-mask-rain-extended";
      setArtworkData(freshArtwork);
    } else {
      fetch(`/api/artworks/${id}`)
        .then((response) => response.json())
        .then((result) => {
          result.bitmap = Pako.inflate(result.meta.bitmap);
          setArtworkData(result);
        })
    }
  }, []);

  if (artworkData == null) {
    return (
      <div className={classes.loading}>
          <h2>Loading, please wait...</h2>
      </div>
    );
  } else {
    return (
      <div className={classes.body}>
        <Canvas
          id="drawing_board"
          bitmap={artworkData.bitmap}
          color={{ r: drawColor.r, g: drawColor.g, b: drawColor.b, a: drawColor.a * 255.0 }}
          thickness={drawThickness}
        ></Canvas>
        <div className={classes.tools}>
          <Container>
            <h3 className={classes.text}>Brush Size</h3>
            <Slider className={classes.text}
              id="thickness_slider"
              defaultValue={8.0}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={1}
              min={8}
              max={100}
              onChange={(event, val) => {
                setDrawThickness(val)
              }}
            ></Slider>
          </Container>
          <Container className={classes.colors}>
            <Container>
              <ChromePicker color={drawColor} onChange={(color, event) => {
                setDrawColor(color.rgb)
              }}></ChromePicker>
            </Container>
            <Box className={classes.buttons}>
              <TextField
                className={classes.field}
                id="name_field"
                label="Name"
                variant="outlined"
                defaultValue={artworkData.meta.name}
                InputLabelProps={{
                  className: classes.label,
                }}
                InputProps={{
                  className: classes.name,
                }}
              />
              <TextField
                className={classes.field}
                id="song_field"
                label="Song"
                variant="outlined"
                defaultValue={artworkData.meta.songId}
                InputLabelProps={{
                  className: classes.label,
                }}
                InputProps={{
                  className: classes.name,
                }}
              />
            </Box>
          </Container>
          {uploadingState === 0 ? <Typography className={classes.readyStatusText}>Ready to be saved or uploaded.</Typography> : null}
          {uploadingState === 1 ? <Typography className={classes.uploadingStatusText}>Uploading, please wait...</Typography> : null}
          {uploadingState === 2 ? <Typography className={classes.uploadedStatusText}>Successfully uploaded!</Typography> : null}
          <Container className={classes.buttons}>
            <Button className={classes.button}
              variant="contained"
              disabled={uploadingState === 1}
              onClick={() => {
                _save(id, history, setUploadingState, false);
              }}
            >
              Save
            </Button>
            <Button className={classes.button}
            disabled={uploadingState === 1}
              variant="contained"
              onClick={() => {
                _save(id, history, setUploadingState, true);
              }}
            >
              Upload
            </Button>
          </Container>
        </div>
      </div >
    );
  }
};

export default EditorScreen;
