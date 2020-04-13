const express = require('express');
const route = new express.Router();
const Message = require("../models/message.js");


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

route.get('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const message = await Message.get(id);
    
    return res.json({message});
  } catch (err) {
    return next(err);
  }
});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

route.post('/', async function (req, res, next) {
  const {from_username, to_username, body} = req.body;
  let message = await Message.create({from_username, to_username, body});
  return res.json({ message });
});


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

route.post('/:id/read', async function (req, res, next) {
  try {
    const id = req.params.id;
    let message = await Message.markRead(id);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

module.exports = route;
