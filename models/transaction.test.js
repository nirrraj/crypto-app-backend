"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Transaction = require("./transaction.js");
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
  let newTransaction = {
    userId: 1,
    transactionType: "buy",
    startCurrencyName: "USD",
    startCurrencyAmount: 2000,
    startCurrencyType: "fiat",
    endCurrencyName: "BTC",
    endCurrencyAmount: 0.1,
    endCurrencyType: "crypto",
    timestampUtc: "2023-04-28 15:32:00.000000"
  };

  test("works", async function () {
    let transaction = await Transaction.create(newTransaction);
    expect(transaction).toEqual({
      ...newTransaction,
      id: expect.any(Number),
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    let userId = 2;
    let transactionRows = await Transaction.findAll(userId);
    expect(transactionRows.length).toEqual(1);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let transaction = await Transaction.get(1);
    expect(transaction).toEqual({
      id: 1,
      userId: 1,
      transactionType: "buy",
      startCurrencyName: "USD",
      startCurrencyAmount: 2000,
      startCurrencyType: "fiat",
      endCurrencyName: "BTC",
      endCurrencyAmount: 0.1,
      endCurrencyType: "crypto",
      timestampUtc: "2023-04-27 21:35:00.000000"
    });
  });

  test("not found if no such transaction", async function () {
    try {
      await Transaction.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});