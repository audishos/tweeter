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
          res.status(200);
          console.log("Am I here??");
          req.session.user_id = user._id;
          res.redirect("/");
        } else {
          res.status(401)
        }
      }
    })
  });

  return usersRoutes;

}