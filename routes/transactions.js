"use strict";

/** Routes for transactions (i.e., buy, sell, deposit, or withdraw records for the user) */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");
const Transaction = require("../models/transaction");
const transactionNewSchema = require("../schemas/transactionNew.json");

const router = express.Router({ mergeParams: true });


/** POST / { transaction } => { transaction }
 *
 * transaction may include { userId, startCurrencyName, startCurrencyAmount, startCurrencyType, endCurrencyName, endCurrencyAmount, endCurrencyType, timestampUtc }
 *
 * Returns { id, userId, startCurrencyName, startCurrencyAmount, startCurrencyType, endCurrencyName, endCurrencyAmount, endCurrencyType, timestampUtc }
 *
 * Authorization required: must be correct user
 */

router.post("/", ensureCorrectUser, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, transactionNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const transaction = await Transaction.create(req.body);
      return res.status(201).json({ transaction });
    } catch (err) {
      return next(err);
    }
  });
  

  /** GET / =>
   *   { transactions: [ { id, userId, startCurrencyName, startCurrencyAmount, startCurrencyType, endCurrencyName, endCurrencyAmount, endCurrencyType, timestampUtc }, ...] }
   * 
   * Authorization required: must be correct user
   */
  
  router.get("/", ensureCorrectUser, async function (req, res, next) {
    try {
      const transactions = await Transaction.findAll(req.query);
      return res.json({ transactions });
    } catch (err) {
      return next(err);
    }
  });
  
  /** GET /[id] => { transaction }
   *
   * Returns { id, userId, currencyName, currencyAmount, currencyType }
   *
   * Authorization required: must be same user
   */
  
  router.get("/:id", ensureCorrectUser, async function (req, res, next) {
    try {
      const transaction = await Transaction.get(req.params.id);
      return res.json({ transaction });
    } catch (err) {
      return next(err);
    }
  });

module.exports = router;