"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    let user = null;
    if (req.session.user_id) {
      user = DataHelpers.findUserById(req.session.user_id, (err, user) => {
        user =  user ? user : userHelper.generateRandomUser();
        const tweet = {
          user: user,
          content: {
            text: req.body.text
          },
          likes: 0,
          created_at: Date.now()
        }
        DataHelpers.saveTweet(tweet, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).send();
          }
        });
      });
    };

  });

  tweetsRoutes.put("/:tweetId/like", (req, res) => {
    DataHelpers.like(req.params.tweetId, req.session.user_id, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).send();
      }
    })
  });

  tweetsRoutes.put("/:tweetId/unlike", (req, res) => {
    DataHelpers.unlike(req.params.tweetId, req.session.user_id, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).send();
      }
    })
  });

  return tweetsRoutes;

}
