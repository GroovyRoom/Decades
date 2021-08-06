const express = require(`express`);
const { OAuth2Client } = require("google-auth-library");
const DB = require(`./src/db_firebase`);
const { IS_RUNNING_ON_GAE } = require("./src/global_helpers");

const clientID =
  "346842459589-sagihg3judk9nvnbunr0j9tfvukqgeuc.apps.googleusercontent.com";

const router = express.Router();
const oauth = new OAuth2Client(clientID);

router.post("/login", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(401).send("Failed to authorize");
    return;
  }

  oauth.verifyIdToken({ idToken: token, audience: clientID }, (err, ticket) => {
    if (err) {
      console.error(err);
      res.status(401).send("Failed to authorize");
      return;
    }

    const payload = ticket.getPayload();
    const userId = payload["sub"];

    //If present then auth was successful
    if (userId) {
      req.session.loggedIn = true;
      req.session.userId = userId;
      res.status(200).send("Success!");
    } else {
      res.status(401).send("Failed to authorize");
    }
  });
});

router.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(401).send("Failed to logout");
      return;
    }

    res.status(200).send("Logged out.");
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(401).send("Failed to logout");
      return;
    }

    res.status(200).send("Logged out.");
  });
});

router.get(`/test`, (req, res) => {
  if (req.session.loggedIn) {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.get("/sessions", async (req, res) => {
  let sess = await DB.getAllSessions();

  res.json(sess);
});

// Debug endpoints
if (!IS_RUNNING_ON_GAE()) {
  // Debug login for non-browser testing
  router.post("/login2/:name", async (req, res) => {
    if (req.session.userId) {
      res
        .status(200)
        .send(`Already logged in, the user id is ${req.session.userId}`);
      return;
    }

    req.session.loggedIn = true;
    req.session.userId = req.params.name;
    res
      .status(200)
      .send(`Successfully logged in! User name is ${req.session.userId}`);
  });

  router.get("/login2/:name", async (req, res) => {
    if (req.session.userId) {
      res
        .status(200)
        .send(`Already logged in, the user id is ${req.session.userId}`);
      return;
    }

    req.session.loggedIn = true;
    req.session.userId = req.params.name;
    res
      .status(200)
      .send(`Successfully logged in! User name is ${req.session.userId}`);
  });
}

module.exports = router;
