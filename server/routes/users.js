"use strict";

const express       = require("express");
const usersRoutes   = express.Router();
const bcrypt        = require("bcrypt");
const userHelper    = require("../lib/util/user-helper")


module.exports = function(DataHelpers) {

  usersRoutes.get("/login", (req, res) => {
    if (req.session.user_id) {
      DataHelpers.findUserById(req.session.user_id, (err, user) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else if (!user) {
          req.session = null;
          res.status(200).send(false);
        } else {
          res.status(200).send(true);
        }
      });
    } else {
      res.status(200).send(false);
    }
  }),

  usersRoutes.post("/login", (req, res) => {
    DataHelpers.findUserByEmail(req.body["login-email"], (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!user) {
        res.status(404);
      } else {
        if (bcrypt.compareSync(req.body["login-password"], user.password)) {
          req.session.user_id = user._id;
          res.status(200).send();
        } else {
          res.status(401).send();
        }
      }
    })
  });

  usersRoutes.post("/logout", (req, res) => {
    req.session = null;
    res.status(200).send();
  });

  usersRoutes.post("/register", (req, res) => {
    DataHelpers.findUserByEmail(req.body["register-email"], (err, existingUser) => {
      if (!existingUser) {
        const newUser = {
          name: req.body["register-name"],
          handle: req.body["register-handle"],
          email: req.body["register-email"],
          password: bcrypt.hashSync(req.body["register-password"], 10),
          avatars: userHelper.generateRandomUser().avatars,
          likes: []
        }
        DataHelpers.createUser(newUser, (err, dbRes) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            req.session.user_id = dbRes.insertedId;
            res.status(201).send();
          }
        });
      } else {
        res.status(409).send();
      }
    })
  });

  return usersRoutes;

}