import React, {useState, useEffect} from "react";
import { Button, ThemeProvider, Typography } from "@material-ui/core";
import { createTheme } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const theme = createTheme({
  palette: {
    text:{
      primary: "#ffffff"
    }
  }
});

const CreateScreen = () => {
  const [artworkData, setArtworkData] = useState(null)
  const history = useHistory();

  // use effect runs only once on component startup
  useEffect(() => {
    fetch(`/api/artworks/local`)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      setArtworkData(result)
    })
  }, [])

  if (artworkData == null){
    return <ThemeProvider theme={theme}><Typography component={'div'} color="textPrimary"><div>Loading, please wait...</div></Typography></ThemeProvider>
  } else {
    return <ThemeProvider theme={theme}><Typography component={'fieldset'} color="textPrimary"><div>
      <Button variant="contained" onClick={()=>history.push(`/editor/new`)}>[+]</Button>
      {artworkData.map(artwork => {
          return <Button key={artwork.id} variant="contained" onClick={()=>{history.push(`/editor/${artwork.id}`)}}>{artwork.name}</Button>
      })}
      </div></Typography></ThemeProvider>
  }
};

export default CreateScreen;