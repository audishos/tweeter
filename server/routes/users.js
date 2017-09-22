"use strict";

const express       = require("express");
const usersRoutes   = express.Router();
const bcrypt        = require("bcrypt");

module.exports = function(DataHelpers) {

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

  // usersRoutes.get("/login", (req, res) => {
  //   if (req.session.user_id) {
  //     res.status
  //   }
  // });

  return usersRoutes;

}