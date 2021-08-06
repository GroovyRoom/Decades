import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import GoogleAuthButton from "../components/GoogleAuthButton";

const useStyles = makeStyles({
  rootHolder: {
    marginTop: 320,
    display: "flex",
    justifyContent: "center",
    padding: "0 10px",
    boxSizing: "border-box",
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 22,
    color: "#fff",
  },

  card: {
    background: "#0A1F1B",
    borderStyle: "solid",
    borderWidth: "0.3px",
    borderColor: "#66FCA6",
  },
});

const LogIn = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.rootHolder}>
      <Card className={classes.card}>
        <CardContent align="center">
          <Typography className={classes.title} variant="h5" component="h2">
            Log in to Decades
          </Typography>
          <GoogleAuthButton authHandler={props.authHandler} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LogIn;
