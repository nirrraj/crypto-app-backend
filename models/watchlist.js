"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");


class Watchlist {
  /** Create a watchlisted currency, update db, return new watchlist entry.
   *
   * data should be { userId, cryptoName }
   *
   * Returns { id, user_id, crypto_name }
   *
   * Throws BadRequestError if crypto_name already in database.
   * */

  static async create({ userId, cryptoName }) {
    const duplicateCheck = await db.query(
          `SELECT id
           FROM watchlists
           WHERE crypto_name = $1`,
        [cryptoName]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate cryptocurrency in watchlist: ${cryptoName}`);

    const result = await db.query(
          `INSERT INTO watchlists
           (user_id, crypto_name)
           VALUES ($1, $2)
           RETURNING id, user_id AS "userId", crypto_name AS "cryptoName"`,
        [
          userId,
          cryptoName,
        ],
    );
    const watchlist = result.rows[0];

    return watchlist;
  }

  /** Find all watchlists (cryptocurrencies being watched) for a given user id.
   *
   * Returns [{ id, cryptoName }, ...]
   * 
   * */

  static async findAll(userId) {
    if(!userId || userId.length === 0){
      throw new BadRequestError(`Missing user id: ${userId}`);
    }

    let query = `SELECT id,
                        crypto_name AS "cryptoName"
                 FROM watchlists
                 WHERE user_id = $1`;

    query += " ORDER BY crypto_name";
    const watchlistsRes = await db.query(query, [userId]);
    return watchlistsRes.rows;
  }

  /** Given a watchlist id, return the user id and crypto name.
   *
   * Returns { userId, cryptoName }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const watchlistsRes = await db.query(
          `SELECT user_id AS "userId",
                  crypto_name AS "cryptoName"
           FROM watchlists
           WHERE id = $1`,
        [id]);

    const watchlist = watchlistsRes.rows[0];
    if (!watchlist) throw new NotFoundError(`No watchlist: ${id}`);
    return watchlist;
  }

  /** Delete given watchlist (crypto asset being watched by user) from database given watchlist id; returns undefined.
   *
   * Throws NotFoundError if watchlist not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM watchlists
           WHERE id = $1
           RETURNING id`,
        [id]);
    const watchlist = result.rows[0];

    if (!watchlist) throw new NotFoundError(`No watchlist: ${id}`);
  }
}

module.exports = Watchlist;