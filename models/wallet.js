"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Wallet {
  /** Create a wallet (holding of a currency asset)
   *
   * data should be { user_id, currency_name, currency_amount, currency_type }
   *
   * Returns { id, user_id, currency_name, currency_amount, currency_type }
   **/

  static async create(data) {
    const result = await db.query(
          `INSERT INTO wallets (user_id,
                             currency_name,
                             currency_amount,
                             currency_type)
           VALUES ($1, $2, $3, $4)
           RETURNING id, user_id AS "userId", currency_name AS "currencyName", currency_amount AS "currencyAmount", currency_type AS "currencyType"`,
        [
          data.userId,
          data.currencyName,
          data.currencyAmount,
          data.currencyType,
        ]);
    let wallet = result.rows[0];
    return wallet;
  }

  /** Get an aggregate wallet (all currency holdings) for a given user id.
   *
   * Returns [{ id, currency_name, currency_amount, currency_type }, ...]
   * */

  static async findAll(userId) {
    const wallet = await db.query(
                `SELECT id,
                        currency_name AS "currencyName",
                        currency_amount AS "currencyAmount",
                        currency_type AS "currencyType",
                 FROM wallets
                 WHERE user_id = $1`, [userId]);

    return wallet.rows;
  }

  /** Given a wallet id, return data about wallet (a particular holding of an asset).
   *
   * Returns { id, user_id, currency_name, currency_ammount, currency_type }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const walletRes = await db.query(
          `SELECT id,
                  user_id AS "userId",
                  currency_name AS "currencyName",
                  currency_amount AS "currencyAmount",
                  currency_type AS "currencyType"
           FROM wallets
           WHERE id = $1`, [id]);

    const wallet = walletRes.rows[0];

    if (!wallet) throw new NotFoundError(`No wallet: ${id}`);
    return wallet;
  }

  /** Update wallet
   *
   * Currently only accepts { currencyAmount }  which is the amount of a particular asset holding
   * 
   * Returns { id, currency_name, currency_amount, currency_type }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE wallet 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                        currency_name AS "currencyName", 
                        currency_amount AS "currencyAmount",
                        currency_type AS "currencyType"`;
    const result = await db.query(querySql, [...values, id]);
    const wallet = result.rows[0];

    if (!wallet) throw new NotFoundError(`No wallet: ${id}`);

    return wallet;
  }

  /** Delete given wallet from database; returns undefined.
   *
   * Throws NotFoundError if not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM wallets
           WHERE id = $1
           RETURNING id`, [id]);
    const wallet = result.rows[0];

    if (!wallet) throw new NotFoundError(`No wallet: ${id}`);
  }
}

module.exports = Wallet;