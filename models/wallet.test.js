"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Wallet = require("./wallet.js");
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
  let newWallet = {
    userId: 1,
    currencyName: "USD",
    currencyAmount: 100,
    currencyType: "fiat",
  };

  test("works", async function () {
    let wallet = await Wallet.create(newWallet);
    expect(wallet).toEqual({
      ...newWallet,
      id: expect.any(Number),
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    let userId = 1;
    let walletRows = await Wallet.findAll(userId);
    expect(walletRows.length).toEqual(2);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let wallet = await Wallet.get(1);
    expect(wallet).toEqual({
      id: 1,
      userId: 1,
      currencyName: "USD",
      currencyAmount: 1000,
      currencyType: "fiat"
    });
  });

  test("not found if no such wallet", async function () {
    try {
      await Wallet.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  let updateData = {
    currencyAmount: 2000
  };
  test("works", async function () {
    let wallet = await Wallet.update(1, updateData);
    expect(wallet).toEqual({
      id: 1,
      currencyName: "USD",
      currencyAmount: 2000,
      currencyType: "fiat"
    });
  });

  test("not found if no such wallet", async function () {
    try {
      await Wallet.update(0, {
        title: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Wallet.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Wallet.remove(1);
    const res = await db.query(
        "SELECT id FROM wallets WHERE id=$1", 1);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such wallet", async function () {
    try {
      await Wallet.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});