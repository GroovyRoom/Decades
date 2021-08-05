import React from "react";
import axios from 'axios';
import Login from "./pages/Login";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Logo from "./components/Logo";
import Menu from "./pages/Menu";
import Music from "./pages/MusicScreen";
import EditorScreen from "./pages/EditorScreen";
import ViewingScreen from "./pages/ViewingScreen";
import PlayScreen from "./pages/PlayScreen";
import CreateScreen from "./pages/CreateScreen";

const theme = createTheme({
  palette: {
    primary: {
      main: "#66FCA6",
    },
    secondary: {
      main: "#FFF",
    },
    background: {
      default: "#0A1F1B",
    },
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {authState: false, login: <Route path="/" exact render={(props) => <Login authHandler={this.authHandler} {...props} />} />,
                   menu: null, music: null, editor: null, view: null, play: null, create: null};
    this.authHandler = this.authHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  authHandler() {
    this.setState({
      authState: true,
      login: null,
      menu: <Route path="/" exact component={Menu} />,
      music: <Route path="/music" exact component={Music} />,
      editor: <Route path="/editor/:id" exact component={EditorScreen} />,
      view: <Route path="/view/:id" exact component={ViewingScreen} />,
      play: <Route path="/play" exact component={PlayScreen} />,
      create: <Route path="/create" exact component={CreateScreen} />
    });
  }

  logoutHandler() {
    this.setState({authState: false, login: <Route path="/" exact render={(props) => <Login authHandler={this.authHandler} {...props} />} />,
                  menu: null, music: null, editor: null, view: null, play: null, create: null});
  }

  componentDidMount(props) {
    axios.get('/api/auth/test').then((res) => {
        if (res.data === true) {
          this.setState({
            authState: true,
            login: null,
            menu: <Route path="/" exact component={Menu} />,
            music: <Route path="/music" exact component={Music} />,
            editor: <Route path="/editor/:id" exact component={EditorScreen} />,
            view: <Route path="/view/:id" exact component={ViewingScreen} />,
            play: <Route path="/play" exact component={PlayScreen} />,
            create: <Route path="/create" exact component={CreateScreen} />
          });
        }
        else {
          this.setState({authState: false, login: <Route path="/" exact render={(props) => <Login authHandler={this.authHandler} {...props} />} />,
                        menu: null, music: null, editor: null, view: null, play: null, create: null});
        }
    });
  }

  componentDidUpdate(prevProps, prevState) {
      axios.get('/api/auth/test').then((res) => {
        if (res.data !== prevState.authState) {
          if (res.data === true) {
            this.setState({
              authState: true,
              login: null,
              menu: <Route path="/" exact render={(props) => <Menu logoutHandler={this.logoutHandler} {...props} />} />,
              music: <Route path="/music" exact component={Music} />,
              editor: <Route path="/editor/:id" exact component={EditorScreen} />,
              view: <Route path="/view/:id" exact component={ViewingScreen} />,
              play: <Route path="/play" exact component={PlayScreen} />,
              create: <Route path="/create" exact component={CreateScreen} />
            });
          }
          else {
            this.setState({authState: false, login: <Route path="/" exact render={(props) => <Login authHandler={this.authHandler} {...props} />} />,
            menu: null, music: null, editor: null, view: null, play: null, create: null});
          }
        }
      });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Logo />
          <Switch>
                {this.state.login}
                {this.state.menu}
                {this.state.music}
                {this.state.editor}
                {this.state.view}
                {this.state.play}
                {this.state.create}
                <Redirect to="/" />
          </Switch>;
        </Router>
      </ThemeProvider>
    )
  }
}

export default App;
