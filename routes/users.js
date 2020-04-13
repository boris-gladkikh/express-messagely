const express = require('express');
const route = new express.Router();
const User = require("../models/user.js");
const ExpressError = require("../expressError.js");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

route.get("/", async function (req, res, next) {
  let results = await User.all();

  return res.json({ users: results })

})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

route.get("/:username", async function (req, res, next) {
  try {
    let username = req.params.username;
    let result = await User.get(username);
    return res.json({ user: result });

  } catch (err) {
    return next(err);
  }

})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

route.get("/:username/to", async function (req, res, next) {
  try {
    let username = req.params.username;
    let results = await User.messagesTo(username);
    return res.json({messages:results})
  }
  catch (err) {
    return next(err);
  }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

route.get("/:username/from", async function(req, res, next) {
  try {
    let username = req.params.username;
    let results = await User.messagesTo(username);
    return res.json({messages:results})
  }
  catch (err) {
    return next(err);
  }

})