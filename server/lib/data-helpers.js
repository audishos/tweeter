"use strict";

let db;

const {MongoClient} = require("mongodb");
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

MongoClient.connect(MONGODB_URI, (err, mongoInstance) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  db = mongoInstance;
  // We have a connection to the "tweeter" db, starting here.
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
});

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers() {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, callback);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      // const sortNewestFirst = (a, b) => a.created_at - b.created_at;
      db.collection("tweets").find().toArray(callback);
    }
  }
};
