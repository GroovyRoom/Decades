import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Grid, Container } from '@material-ui/core';
import plus_icon from '../resources/plus_icon.png';
import Pako from 'pako'
import Jimp from 'jimp'

const useStyles = makeStyles({
  body: {
    marginTop: 100,
    flexGrow: 1
  },
  root: {
    width: 345,
    border: '2px solid #0a5d00',
    background: '#0A1F1B',
  },
  text: {
    color: 'white',
  },
  media: {
    height: 290,
  },
});

const CreateScreen = () => {
  const [artworkData, setArtworkData] = useState(null)
  const history = useHistory();
  const classes = useStyles();

  // use effect runs only once on component startup
  useEffect(() => {
    async function getData(){
      const response = await fetch(`/api/artworks/local`)
      const result = await response.json()

      for (let i = 0; i<result.length; i++) {
        result[i].bitmapUncompressed = Pako.inflate(result[i].bitmap);
        const image = await new Jimp({data:result[i].bitmapUncompressed, width:640, height:640})

        image.resize(400, 400)
        image.crop(20, 55, 360, 290)

        const base64 = await image.getBase64Async(Jimp.MIME_PNG)
        result[i].imagePng = base64
      }
      
      setArtworkData(result)
    }
    getData()
  }, [])

  if (artworkData == null) {
    return <div>Loading, please wait...</div>
  } else {
    return <div className={classes.body}>
      <Container>
        <Grid container spacing={10}>
          <Grid item lg={4}>
            <Card className={classes.root} onClick={() => history.push(`/editor/new`)}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={plus_icon}
                  component='img'
                />
                <CardContent>
                  <Typography className={classes.text} gutterBottom variant="h5" component="h2">
                    New Reality
                  </Typography>
                  <Typography className={classes.text} variant="body2" color="textSecondary" component="p">
                    Here you can create your own, unique new masterpiece
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {artworkData.map(artwork => {
            return <Grid item lg={4}>
              <Card className={classes.root} key={artwork.id} variant="contained" onClick={() => { history.push(`/editor/${artwork.id}`) }}>
                <CardActionArea>
                  <CardMedia>
                    <img src={artwork.imagePng} alt="thumbnail" height={`${290}px`}/>
                  </CardMedia>
                  <CardContent>
                    <Typography className={classes.text} gutterBottom variant="h5" component="h2">
                      {artwork.name}
                    </Typography>
                    <Typography className={classes.text} variant="body2" color="textSecondary" component="p">
                      Description to be added
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          })}
        </Grid>
      </Container >
    </div >
  }
};

export default CreateScreen;