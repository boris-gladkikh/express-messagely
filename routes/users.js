const express = require('express');
const route = new express.Router();
const User = require("../models/user.js");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

route.get("/", 
  ensureLoggedIn,
  async function (req, res, next) {
    let results = await User.all();

    return res.json({ users: results })
  }
);

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

route.get("/:username", 
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let username = req.params.username;
      let result = await User.get(username);
      return res.json({ user: result });

    } catch (err) {
      return next(err);
    }
  }
)


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

route.get("/:username/to", 
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let username = req.params.username;
      let results = await User.messagesTo(username);
      return res.json({messages:results})
    }
    catch (err) {
      return next(err);
    }
  }
);

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

route.get("/:username/from", 
  ensureCorrectUser,
  async function(req, res, next) {
    try {
      let username = req.params.username;
      let results = await User.messagesFrom(username);
      return res.json({messages:results})
    }
    catch (err) {
      return next(err);
    }

  }
)

module.exports = route;
