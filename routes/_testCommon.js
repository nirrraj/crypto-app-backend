"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Watchlist = require("../models/watchlist");
const Wallet = require("../models/wallet");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM watchlists");
  await db.query("DELETE FROM transactions");

  await Watchlist.create(
      {
        userId: "u1",
        cryptoName: "BTC",
      });
  await Watchlist.create(
      {
        userId: "u1",
        cryptoName: "ETH",
      });
  await Watchlist.create(
      {
        userId: "u2",
        cryptoName: "DOGE",
      });

  await User.register({
    username: "u1",
    email: "user1@user.com",
    password: "password1",
    nativeFiatCurrency: "USD",
  });
  await User.register({
    username: "u2",
    email: "user2@user.com",
    password: "password2",
    nativeFiatCurrency: "USD",
  });
  await User.register({
    username: "u3",
    email: "user3@user.com",
    password: "password3",
    nativeFiatCurrency: "INR",
  });

  await Transaction.create({
      userId: "u1",
      startCurrencyName: "USD",
      startCurrencyAmount: 2000,
      startCurrencyType: "fiat",
      endCurrencyName: "BTC",
      endCurrencyAmount: 0.1,
      endCurrencyType: "crypto",
      timestampUtc: "2023-04-29 18:44:00.000000",
    }
  )
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
};