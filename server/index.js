"use strict";

const dotenv = require('dotenv').config();
const path = require('path');
// Basic express setup:

const PORT          = process.env.PORT || 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const sassMiddleware = require("node-sass-middleware");
const app           = express();
const cookieSession = require("cookie-session")

app.use(bodyParser.urlencoded({ extended: true }));

app.use(sassMiddleware({
  /* Options */
  src: path.join(__dirname, "../styles"),
  dest: path.join(__dirname, "../public/styles"),
  debug: true,
  outputStyle: "expanded",
  prefix:  "/styles"  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

app.use("/", express.static("public"));

app.use(cookieSession({
  name: "session",
  keys: [
    "b370de14e94142d4a108a79df6d0e265a0ba3fa2e10f57c4b3a892b74c9f84aa",
    "26cb941323ef3be96a33e7dec1a6e8e4a9075e3f55b4eb818a292c6ad368f0e9"
  ]
}));

// const addLoginStatus = require("./lib/header-middleware.js");
// app.use(addLoginStatus);

// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:
const DataHelpers = require("./lib/data-helpers.js")();

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.
const tweetsRoutes = require("./routes/tweets")(DataHelpers);
const usersRoutes = require("./routes/users")(DataHelpers);

// Mount the tweets routes at the "/tweets" path prefix:
app.use("/tweets", tweetsRoutes);
app.use("/users", usersRoutes);

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
