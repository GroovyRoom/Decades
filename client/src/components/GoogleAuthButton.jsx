import React, { useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { createTheme } from "@material-ui/core";
import { ThemeProvider, Typography } from "@material-ui/core";

const theme = createTheme({
  palette: {
    text: {
      primary: "#ffffff",
    },
  },
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

function GoogleAuthButton(props) {
  const [auth, setAuth] = useState("Checking credentials...");

  useEffect(() => {
    setAuth(
      <GoogleLogin
        clientId="346842459589-sagihg3judk9nvnbunr0j9tfvukqgeuc.apps.googleusercontent.com"
        buttonText="Log in with Google"
        onSuccess={async (data) =>
          handleLogin(data, (status) => props.authHandler())
        }
        onFailure={async (data) =>
          handleLogin(data, (status) => props.authHandler())
        }
        cookiePolicy={"single_host_origin"}
      />
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Typography component={"div"} color="textPrimary">
        <div>{auth}</div>
      </Typography>
    </ThemeProvider>
  );
}

export default GoogleAuthButton;
