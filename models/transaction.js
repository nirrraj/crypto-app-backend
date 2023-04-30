"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");

class Transaction {
    /** Create a transaction (buy, sell, deposit, or withdraw event)
     *
     * data should be { userId, transactionType, startCurrencyName, startCurrencyAmount, startCurrencyType, 
     *                  endCurrencyName, endCurrencyAmount, endCurrencyType, timestampUtc}
     *
     * Returns { id, userId, transactionType, startCurrencyName, startCurrencyAmount, startCurrencyType, 
     *           endCurrencyName, endCurrencyAmount, endCurrencyType, timestampUtc}
     **/

    static async create(data){
        const result = await db.query(
            `INSERT into transactions ( user_id,
                                    transaction_type,
                                    start_currency_name,
                                    start_currency_amount,
                                    start_currency_type,
                                    end_currency_name,
                                    end_currency_amount,
                                    end_currency_type,
                                    timestamp_utc)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, user_id AS "userId", transaction_type AS "transactionType", start_currency_name AS "startCurrencyName", 
                        start_currency_amount AS "startCurrencyAmount", start_currency_type AS "startCurrencyType", 
                        end_currency_name AS "endCurrencyName", end_currency_amount AS "endCurrencyAmount", 
                        end_currency_type AS "endCurrencyType", timestamp_utc AS "timestampUtc"`,
        [
            data.userId,
            data.transactionType,
            data.startCurrencyName,
            data.startCurrencyAmount,
            data.startCurrencyType,
            data.endCurrencyName,
            data.endCurrencyAmount,
            data.endCurrencyType,
            data.timestampUtc,
        ]);

        let transaction = result.rows[0];
        return transaction;
    };

    /** Get all transactions (buy, sell, deposit, or withdraw events) for a given user id
     *
     * Returns [{id, transactionType, startCurrencyName, startCurrencyAmount, startCurrencyType, endCurrencyName, endCurrencyAmount, endCurrencyType, timestampUtc}, ...]
     **/

    static async findAll(userId){
        const transactions = await db.query(
            `SELECT id,
                    transaction_type AS "transactionType",
                    start_currency_name AS "startCurrencyName",
                    start_currency_amount AS "startCurrencyAmount",
                    start_currency_type AS "startCurrencyType",
                    end_currency_name AS "endCurrencyName",
                    end_currency_amount AS "endCurrencyAmount",
                    end_currency_type AS "endCurrencyType",
                    timestamp_utc AS "timestampUtc",
            FROM transactions
            WHERE user_id = $1`,[userId]);

        return transactions.rows;
    };


    /** Get a transaction by id
     *
     * Returns [{id, userId, transactionType, startCurrencyName, startCurrencyAmount, startCurrencyType, endCurrencyName, endCurrencyAmount, endCurrencyType, timestampUtc}, ...]
     **/

    static async get(id){
        const transactionRes = await db.query(
            `SELECT id,
                    user_id AS "userId",
                    transaction_type AS "transactionType",
                    start_currency_name AS "startCurrencyName",
                    start_currency_amount AS "startCurrencyAmount",
                    start_currency_type AS "startCurrencyType",
                    end_currency_name AS "endCurrencyName",
                    end_currency_amount AS "endCurrencyAmount",
                    end_currency_type AS "endCurrencyType",
                    timestamp_utc AS "timestampUtc",
            FROM transactions
            WHERE id = $1`,[id]);

        const transaction = transactionRes.rows[0];

        if (!transaction) throw new NotFoundError(`No transaction: ${id}`);
        return transaction;
    };

    // there are no update or delete options because the list of transactions is a permanent ledger
}

module.exports = Transaction;