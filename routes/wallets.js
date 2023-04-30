"use strict";

/** Routes for wallets (i.e., asset holdings) */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");
const Wallet = require("../models/wallet");
const walletNewSchema = require("../schemas/walletNew.json");
const walletUpdateSchema = require("../schemas/walletUpdate.json");

const router = express.Router({ mergeParams: true });


/** POST / { wallet } => { wallet }
 *
 * wallet should be { userId, currencyName, currencyAmount, currencyType }
 *
 * Returns { id, userId, currencyName, currencyAmount, currencyType }
 *
 * Authorization required: must be same user
 */

router.post("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, walletNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const wallet = await Wallet.create(req.body);
    return res.status(201).json({ wallet });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { wallets: [ { id, userId, currencyName, currencyAmount, currencyType }, ...] }
 * 
 * Authorization required: must be same user
 */

router.get("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const wallets = await Wallet.findAll(req.query);
    return res.json({ wallets });
  } catch (err) {
    return next(err);
  }
});

/** GET /[walletId] => { wallet }
 *
 * Returns { id, userId, currencyName, currencyAmount, currencyType }
 *
 * Authorization required: must be same user
 */

router.get("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const wallet = await Wallet.get(req.params.id);
    return res.json({ wallet });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[walletId]  { currencyAmount } => { wallet }
 *
 * Data can include: { currencyAmount }
 *
 * Returns { id, userId, currencyName, currencyAmount, currencyType }
 *
 * Authorization required: must be same user
 */

router.patch("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, walletUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const wallet = await Wallet.update(req.params.id, req.body);
    return res.json({ wallet });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: must be same user
 */

router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    await Wallet.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;