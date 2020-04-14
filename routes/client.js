const express = require('express');
const route = new express.Router();


route.get("/", function (req, res, next) {

  return res.render("register.html")

});


// registration page

// login page

// page to see all your messages (both from and to)

// detail page for each msg

// new message page, drop down of users





module.exports = route;