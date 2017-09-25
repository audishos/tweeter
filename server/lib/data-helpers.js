"use strict";

let db; // globally scope the db

const {MongoClient} = require("mongodb");
const ObjectId = require("mongodb").ObjectID;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tweeter";

MongoClient.connect(MONGODB_URI, (err, mongoInstance) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  db = mongoInstance;
  // We have a connection to the "tweeter" db, starting here.
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
});

// The code below here is to make sure that we close the conncetion to mongo when this node process terminates
function gracefulShutdown() {
  console.log("\nShutting down gracefully...");
  try {
    db.close();
  }
  catch (err) {
    throw err;
  }
  finally {
    console.log("I'll be back.");
    process.exit();
  }
}

process.on("SIGTERM", gracefulShutdown); // listen for TERM signal .e.g. kill
process.on("SIGINT", gracefulShutdown);  // listen for INT signal e.g. Ctrl-C

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
    },

    // Adds 1 like to the tweet
    like: function(tweetId, userId, callback) {
      db.collection("tweets").findOneAndUpdate({_id: ObjectId(tweetId)}, {$inc: {likes: 1}}, callback);
      db.collection("users").findOneAndUpdate({_id: ObjectId(userId)}, {$push: {likes: tweetId}});
    },
    // Removes 1 like to the tweet
    unlike: function(tweetId, userId, callback) {
      db.collection("tweets").findOneAndUpdate({_id: ObjectId(tweetId)}, {$inc: {likes: -1}}, callback);
      db.collection("users").findOneAndUpdate({_id: ObjectId(userId)}, {$pop: {likes: tweetId}});
    },

    findUserById: function(userId, callback) {
      db.collection("users").findOne({ _id: ObjectId(userId) }, callback);
    },

    findUserByEmail: function(email, callback) {
      db.collection("users").findOne({ email: email }, callback);
    },

    createUser: function(user, callback) {
      db.collection("users").insertOne(user, callback);
    }
  };
};
