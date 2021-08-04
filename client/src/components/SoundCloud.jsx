import React from 'react';
import load from 'load-script';

class SoundCloud extends React.Component {
  constructor(props) {
    super(props);
    this.id = "sc"; // id of the iframe
    this.gwidget = ""; // global widget variable
    this.currURL = ""; // current playing URL
    this.baseURL = "https://w.soundcloud.com/player/?url=";
  }

  // on initial component mount
  componentDidMount() {
    this.loadScript((widget) => {
      this.initWidget(widget);
    })
  }

  // on variable update
  componentDidUpdate() {
    this.updateWidget();
  }

  // loads soundcloud's script so we can access their functions
  loadScript(callback) {
    return load("https://w.soundcloud.com/player/api.js", () => {
      return callback(window.SC.Widget(this.id));
    })
  }

  // save the object to gwidget
  // initial update of the widgets components
  initWidget(widget) {
    this.gwidget = widget;
    this.updateWidget();

    // loop track
    this.gwidget.bind(window.SC.Widget.Events.FINISH, () => {
      this.gwidget.seekTo(0);
      this.gwidget.play();
    })
  }

  // update the widgets components
  updateWidget() {
    this.updateURL();
    this.checkStatusProp();
  }

  // updates the widget url if different
  updateURL() {
    if (this.currURL !== this.props.url) {
      this.gwidget.load(this.props.url);
      this.currURL = this.props.url;
    }
  }

  // checks the status prop
  checkStatusProp() {
    if (this.props.status === -1) {
      this.chromeReload();
    }
    else if (this.props.status === 1) {
      this.gwidget.bind(window.SC.Widget.Events.READY, () => {
        this.gwidget.play();
      })
    }
    else {
      this.gwidget.bind(window.SC.Widget.Events.READY, () => {
        this.gwidget.pause();
      })
    }
  }

  // reload widget so it plays after one click on chrome
  // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
  // autoplays on firefox
  chromeReload() {
    this.gwidget.load(this.props.url);
    this.gwidget.bind(window.SC.Widget.Events.READY, () => {
      this.gwidget.play();
    });
  }

  render() {
    return (
      <iframe src={this.baseURL} width="1" height="1" id={this.id} frameBorder="0" title="SoundCloud widget" allow="autoplay">
      </iframe>
    )
  }
}

export default SoundCloud;
