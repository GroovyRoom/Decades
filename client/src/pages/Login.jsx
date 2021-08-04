import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import GoogleAuthButton from '../components/GoogleAuthButton'


const useStyles = makeStyles({
  rootHolder: {
    minWidth: 260,
    maxWidth: 330,
    marginTop: "100px",
    marginLeft: "470px",
    padding: "0 10px",
    boxSizing: "border-box",
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 22,
    color: '#fff'
  },

  card: { 
      background: '#0A1F1B',
      borderStyle:'solid',
      borderWidth:'0.3px',
      borderColor:'#66FCA6',
  }
});

const LogIn = () => {
  const classes = useStyles();

  function handleClick(e) {
    alert('The link was clicked.');
  };

  return (
    <div className={classes.rootHolder}>
      <Card className={classes.card}>
        <CardContent  align='center'>
          <Typography className={classes.title} variant="h5" component="h2">
            Log in to Decades
          </Typography>
          <GoogleAuthButton />
        </CardContent>
      </Card>
    </div>
  );
};

export default LogIn;
