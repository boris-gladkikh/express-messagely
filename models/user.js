/** User class for message.ly */
const { BCRYPT_WORK_FACTOR } = require('../config')
const bcrypt = require('bcrypt');
const ExpressError = require('../expressError.js');
const db = require("../db.js")


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    let result = await db.query(
      `INSERT INTO  users (username, 
        password, 
        first_name, 
        last_name, 
        phone,
        join_at,
        last_login_at)
      VALUES ($1, $2, $3, $4, $5,  current_timestamp, current_timestamp)
      RETURNING username, password, first_name, last_name, phone`,
      [username, hashedPassword, first_name, last_name, phone]
    );

    return result.rows[0];

  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    let savedPassword = await db.query(
      `SELECT password
      FROM users
      WHERE username = $1`,
      [username]
    )
    let authenticated = await bcrypt.compare(password, savedPassword.rows[0].password)

    return authenticated;
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    try {
      let updatedTime = await db.query(
        `UPDATE users
        SET  last_login_at = current_timestamp
        WHERE username = $1
        RETURNING last_login_at`,
        [username]
      );
    } catch (err) {
      throw new ExpressError("User doesn't exist", 404);
    }


  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    let results = await db.query(
      `SELECT username, first_name, last_name
      FROM users
      `
    );
    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    let result = await db.query(
      `SELECT username,
                first_name,
                last_name,
                phone,
                join_at,
                last_login_at
        FROM users
        where username = $1`,
      [username]
    );
    if (result.rows.length !== 0) {
      return result.rows[0];
    }
    else {
      throw new ExpressError(`${username} is not a valid user.`, 404);
    }
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {

    let results = await db.query(
      `SELECT m.id, 
              m.body, 
              m.sent_at,
              m.read_at,
              u.username,
              u.first_name,
              u.last_name,
              u.phone       
      FROM messages as m
      JOIN users as u
      ON to_username= u.username
      WHERE from_username = $1`,
      [username]
    );
    if (results.rows.length !== 0) {
      let messages = results.rows.map(u => {
        return {
          id: u.id,
          to_user: {
            username: u.username,
            first_name: u.first_name,
            last_name: u.last_name,
            phone: u.phone
          },
          body: u.body,
          sent_at: u.sent_at,
          read_at: u.read_at
        }
      })
      return messages
    }
    else {
      throw new ExpressError(`No messages from ${username}`, 404)
    }

  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    let results = await db.query(
      `SELECT m.id, 
              m.body, 
              m.sent_at,
              m.read_at,
              u.username,
              u.first_name,
              u.last_name,
              u.phone       
      FROM messages as m
      JOIN users as u
      ON from_username= u.username
      WHERE to_username = $1`,
      [username]
    );
    if (results.rows.length !== 0) {
      let messages = results.rows.map(u => {
        return {
          id: u.id,
          from_user: {
            username: u.username,
            first_name: u.first_name,
            last_name: u.last_name,
            phone: u.phone
          },
          body: u.body,
          sent_at: u.sent_at,
          read_at: u.read_at
        }
      })
      return messages
    }
    else {
      throw new ExpressError(`No messages/Invalid user`, 404)
    }

  }
}


module.exports = User;