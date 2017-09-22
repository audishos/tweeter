"use strict";

const express       = require('express');
const usersRoutes   = express.Router();

module.exports = function(DataHelpers) {

  usersRoutes.post("/login", (req, res) => {
    console.log(req.body);
    DataHelpers.findUserByEmail(req.body["login-email"], (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!user) {
        res.status(404);
      } else {
        console.log(user);
      }
    })
  });

  return usersRoutes;

}