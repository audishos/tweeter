"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      const {MongoClient} = require("mongodb");
      const MONGODB_URI = "mongodb://localhost:27017/tweeter";

      MongoClient.connect(MONGODB_URI, (err, db) => {
        if (err) {
          console.error(`Failed to connect: ${MONGODB_URI}`);
          throw err;
        }

        // We have a connection to the "tweeter" db, starting here.
        console.log(`Connected to mongodb: ${MONGODB_URI}`);
        db.collection("tweets").insertOne(newTweet);
        callback(null, true);
        db.close();
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      const {MongoClient} = require("mongodb");
      const MONGODB_URI = "mongodb://localhost:27017/tweeter";

      MongoClient.connect(MONGODB_URI, (err, db) => {
        if (err) {
          console.error(`Failed to connect: ${MONGODB_URI}`);
          throw err;
        }

        // We have a connection to the "tweeter" db, starting here.
        console.log(`Connected to mongodb: ${MONGODB_URI}`);
        // const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        db.collection("tweets").find().toArray(callback);
        db.close();
      });
    }

  };
}
