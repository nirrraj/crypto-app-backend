"use strict";

/** Routes for watchlists. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");
const Watchlist = require("../models/watchlist");

const watchlistNewSchema = require("../schemas/watchlistNew.json");

const router = new express.Router();


/** POST / { watchlist } =>  { watchlist }
 *
 * watchlist should be { userId, cryptoName }
 *
 * Returns { id, userId, cryptoName }
 *
 * Authorization required: correct user
 */

router.post("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, watchlistNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const watchlist = await Watchlist.create(req.body);
    return res.status(201).json({ watchlist });
  } catch (err) {
    return next(err);
  }
});


/** GET / =>
 *   { watchlists: [ { id, userId, currencyName, currencyAmount, currencyType }, ...] }
 * 
 * Authorization required: must be same user
 */

router.get("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const watchlists = await Watchlist.findAll(req.query);
    return res.json({ watchlists });
  } catch (err) {
    return next(err);
  }
});


/** GET /[id] => { watchlist }
 * 
 * Returns  { id, userId, cryptoName }
 *
 * Authorization required: correct user
 */

router.get("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const watchlist = await Watchlist.findAll(req.params.id);
    return res.json({ watchlist });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: correct user
 */

router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    await Watchlist.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;