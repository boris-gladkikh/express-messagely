const express = require('express');
const route = new express.Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config.js");
const ExpressError = require("../expressError.js")






// ** POST /login - login: {username, password} => {token}
//  *
//  * Make sure to update their last-login!
//  *
//  **/

route.post("/login", async function (req, res, next) {
  let { username, password } = req.body;
  if (await User.authenticate(username, password) === true) {
    let payload = { username };
    let token = jwt.sign(payload, SECRET_KEY);
    await User.updateLoginTimestamp(username);

    return res.json({ token });
  } else {
    let err = new ExpressError("invalid username/password", 400)
    return next(err);
  }

})



/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

route.post("/register", async function (req, res, next) {
  try {
    let { username, password, first_name, last_name, phone } = req.body;
    User.register({ username, password, first_name, last_name, phone });
    let payload = { username };
    let token = jwt.sign(payload, SECRET_KEY);
    await User.updateLoginTimestamp(username);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }

})

