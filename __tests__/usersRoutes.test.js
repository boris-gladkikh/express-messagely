process.env.NODE_ENV = "test"
const request = require("supertest");
const app = require("../app.js");
const db = require("../db");
const User = require("../models/user.js");
const Message = require("../models/message.js");



const express = require('express');

describe("User Routes Test", function () {
  let u1, u2, m1, m2;


  beforeEach(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");

    u1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "boris",
      last_name: "Testy1",
      phone: "+14155550000",
    });

    u2 = await User.register({
      username: "test2",
      password: "password",
      first_name: "terry",
      last_name: "Testy2",
      phone: "+14155551111"
    });

    m1 = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "how's it hangin"
    });

    m2 = await Message.create({
      from_username: "test2",
      to_username: "test1",
      body: "Ay what's good"
    });

  });
  test("get all users", async function () {
    let responseLogin = await request(app)
      .post("/auth/login")
      .send({
        username: "test1",
        password: "password"
      })

    let responseGetUsers = await request(app)
    .get("/users")
    .send({_token:responseLogin.body.token});

    expect(responseGetUsers.statusCode).toBe(200);
    expect(responseGetUsers.body.users.length).toBe(2);
      
  });

  test("get all users, pessimistic", async function () {
    
    let responseGetUsers = await request(app)
    .get("/users")
    .send({_token:"beans"});

    expect(responseGetUsers.statusCode).toBe(401);
      
  });

  test("get a user",async function () {
    let responseLogin = await request(app)
    .post("/auth/login")
    .send({
      username: "test1",
      password: "password"
    });

  let responseGetUser = await request(app)
  .get("/users/test1")
  .send({_token:responseLogin.body.token});

  expect(responseGetUser.statusCode).toBe(200);
  expect(responseGetUser.body).toEqual(
    {user:{
      username: "test1",
      first_name: "boris",
      last_name: "Testy1",
      phone: "+14155550000",
      last_login_at: expect.any(String),
      join_at: expect.any(String)
    }}
  )

  });

  test("get message to User", async function () {
    let responseLogin = await request(app)
    .post("/auth/login")
    .send({
      username: "test1",
      password: "password"
    });

    let responseMessageTo = await request(app)
    .get("/users/test1/to")
    .send({_token:responseLogin.body.token});

    expect(responseMessageTo.statusCode).toBe(200);
    expect(responseMessageTo.body.messages.length).toBe(1);
    expect(responseMessageTo.body.messages[0].body).toEqual(
      "Ay what's good"
    );
    expect(responseMessageTo.body.messages[0].body).not.toEqual(
      "how's it hangin"
      );

  });

  test("get message from User", async function () {
    let responseLogin = await request(app)
    .post("/auth/login")
    .send({
      username: "test1",
      password: "password"
    });

    let responseMessageFrom = await request(app)
    .get("/users/test1/from")
    .send({_token:responseLogin.body.token});

    expect(responseMessageFrom.statusCode).toBe(200);
    expect(responseMessageFrom.body.messages.length).toBe(1);
    expect(responseMessageFrom.body.messages[0].body).toEqual(
      "how's it hangin"
    );
});

});

