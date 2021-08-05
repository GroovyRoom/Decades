import React, { useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { createTheme } from "@material-ui/core";
import { ThemeProvider, Typography } from "@material-ui/core";

const theme = createTheme({
  palette: {
    text:{
      primary: "#ffffff"
    }
  }
});

const handleLogin = async (googleData, callback) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ token: googleData.tokenId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Proceed only server returned 200 which confirms legal token
  if (res.status === 200) {
    callback(true);
  }
};

function GoogleLog(props) {
  return (
    <GoogleLogin
      clientId="244554015002-dq6ervkiinn5ocu3c0bkngrgnmtalfok.apps.googleusercontent.com"
      buttonText="Log in with Google"
      onSuccess={handleLogin}
      onFailure={handleLogin}
      cookiePolicy={"single_host_origin"}
    />
  );
}

function GoogleAuthButton(props) {
  const history = useHistory();
  const [auth, setAuth] = useState("Checking credentials...");

  useEffect(() => {
    setAuth(
      <GoogleLogin
        clientId="244554015002-dq6ervkiinn5ocu3c0bkngrgnmtalfok.apps.googleusercontent.com"
        buttonText="Log in with Google"
        onSuccess={async (data) => handleLogin(data, (status) => props.authHandler())}
        onFailure={async (data) => handleLogin(data, (status) => props.authHandler())}
        cookiePolicy={"single_host_origin"}
      />
        );}, []);

  return <ThemeProvider theme={theme}><Typography component={'div'} color="textPrimary"><div>{auth}</div></Typography></ThemeProvider>;
}

export default GoogleAuthButton;
