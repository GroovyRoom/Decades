import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./pages/Login";
import LoadingScreen from "./pages/LoadingScreen";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Logo from './components/Logo'
import Menu from './pages/Menu'

const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#000",
    },
    background: {
      default: "#0A1F1B",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Logo />
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/loading" exact component={LoadingScreen} />
          <Route path="/menu" exact component={Menu} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
