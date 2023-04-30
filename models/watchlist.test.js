"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Watchlist = require("./watchlist.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newWatchlist = {
    userId: "newUser1",
    cryptoName: "NEW"
  };

  test("works", async function () {
    let watchlist = await Watchlist.create(newWatchlist);
    expect(watchlist).toEqual(newWatchlist);

    const result = await db.query(
          `SELECT user_id AS "userId", crypto_name AS "cryptoName"
           FROM watchlists
           WHERE user_id = 'newUser1'`);
    expect(result.rows).toEqual([
      {
        userId: "newUser1",
        cryptoName: "NEW",
      },
    ]);
  });

  test("bad request with duplicate", async function () {
    try {
      await Watchlist.create(newWatchlist);
      await Watchlist.create(newWatchlist);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: by name", async function () {
    let watchlists = await Watchlist.findAll({ userId: 2 });
    expect(watchlists).toEqual([
      {
        id: 3,
        cryptoName: "DOGE",
      },
    ]);
  });

  test("works: empty list on nothing found", async function () {
    let watchlists = await Watchlist.findAll({ name: "nope" });
    expect(watchlists).toEqual([]);
  });

  test("bad request if missing user id", async function () {
    try {
      await Watchlist.findAll();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let watchlist = await Watchlist.get(1);
    expect(watchlist).toEqual({
      userId: 1,
      cryptoName: "BTC",
    });
  });

  test("not found if no such watchlist", async function () {
    try {
      await Watchlist.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Watchlist.remove(1);
    const res = await db.query(
        "SELECT id FROM watchlists WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such watchlist", async function () {
    try {
      await Watchlist.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});