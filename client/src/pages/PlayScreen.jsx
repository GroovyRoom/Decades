import React, {useState, useEffect} from "react";
import { 
  Button, 
  Typography,
  makeStyles,
  Card, 
  CardContent,
  CardMedia,
  CardActions,
  Grid,
 } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from "react-router-dom";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Pako from 'pako'
import Jimp from 'jimp'

const useStyles = makeStyles(({ spacing, palette }) => ({
  Root: { 
    display: 'flex',
    justifyContent: 'center',
    margin: spacing(1.5)
  },
  CardRoot: {
    maxWidth: 345, 
    margin: spacing(1),
    borderStyle:'solid',
    borderWidth:'0.3px',
    borderColor:'#66FCA6',
    background: '#0A1F1B',
  }, 
  headerFont: { 
    fontSize: '18px',
    color: '#ffff'
  }, 
  bodyFont: { 
    fontSize: '14px',
    color: '#ffff'
  }, 
  buttonProceed: { 
      background: 'linear-gradient(45deg, #54c786 10%, #0A1F1B 80%)',
      color: 'white',
  },
  buttonLike:{
    color: '#66FCA6'
  }, 
  loading: { 
    color: '#fff',
    display: 'flex', 
    justifyContent: 'center'
  }
}));

const PlayScreen = () => {
  const classes = useStyles();
  const [artworkData, setArtworkData] = useState(null)
  const history = useHistory();


  // use effect runs only once on component startup
  useEffect(() => {
    async function getData(){
      const response = await fetch(`/api/artworks/uploaded`)
      const result = await response.json()

      for (let i = 0; i<result.length; i++) {
        result[i].bitmapUncompressed = Pako.inflate(result[i].bitmap);
        const image = await new Jimp({data:result[i].bitmapUncompressed, width:640, height:640})

        image.resize(400, 400)
        image.crop(20, 115, 360, 170)

        const base64 = await image.getBase64Async(Jimp.MIME_PNG)
        result[i].imagePng = base64
      }
      
      setArtworkData(result)
    }
    getData()
  }, [])
  
  const renderCard = () => { 
    return(
      <Grid container className={classes.Root} spacing={3}>
      {artworkData.map((artwork) => (
        <Grid item xs={4}>
          <Card className={classes.CardRoot}>
            <CardMedia>
              <img src={artwork.imagePng} alt="thumbnail" height={`${170}px`}/>
            </CardMedia>
            <CardContent>
              <Typography className={classes.headerFont}>
                {artwork.name}
              </Typography>
              <Typography className={classes.bodyFont}>
                In Discovery of Gold Portinari broke both with the Ministry
                frescoes and the World's Fair decorations.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                key={artwork.id}
                onClick={() => {
                  history.push(`/view/${artwork.id}`);
                }}
                className={classes.buttonProceed}
              >
                Proceed to Artwork
              </Button>
              <IconButton 
              className={classes.buttonLike} 
              size='medium'
              >
                <FavoriteBorderIcon
                />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
    )
  }
  if (artworkData == null){
    return (
      <div className={classes.loading}>
        <h2>Loading, please wait...</h2>
      </div>
    );
  } else {
    return (
      renderCard()
    );
  }
};

export default PlayScreen;
