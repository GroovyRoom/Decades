// Libraries
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const { FirestoreStore } = require("@google-cloud/connect-firestore");
const FirestoreClient = require("./routes/src/firestoreClient");
const session = require("express-session");

// Routes
var artworksRouter = require("./routes/artworks");
var debugRouter = require("./routes/debug");
var reactRouter = require("./routes/react");
var authRouter = require("./routes/auth");

// Helpers
const { IS_RUNNING_ON_GAE } = require("./routes/src/global_helpers");

var app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Create a firestore database to persistently store our sessions.
app.use(
  session({
    store: new FirestoreStore({
      dataset: FirestoreClient.firestore,
      kind: "sessions",
    }),
    secret: "cat",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// Locally we will serve that build/ directory here
if (!IS_RUNNING_ON_GAE()) {
  app.use(express.static(path.join(__dirname, "/client/build")));
}

app.use("/api/auth/", authRouter);
app.use("/api/artworks/", artworksRouter);

// Can use debug api for local testing
if (!IS_RUNNING_ON_GAE()) {
  app.use("/api/debug/", debugRouter);
}

// Catch-all for react routes
app.use("/*", reactRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // only log for debugging
  if (!IS_RUNNING_ON_GAE()) {
    console.log(`[DECADES] Server experienced an error...`);
  }

  console.error(err);

  // send the error back
  res.status(err.status || 500);
  res.send("Something broke!");
});

module.exports = app;
