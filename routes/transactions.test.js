"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /transactions */

describe("POST /transactions", function () {
  test("works if same user", async function () {
    const resp = await request(app)
        .post(`/transactions`)
        .send({
          userId: "u1",
          startCurrencyName: "USD",
          startCurrencyAmount: 2000,
          startCurrencyType: "fiat",
          endCurrencyName: "BTC",
          endCurrencyAmount: 0.1,
          endCurrencyType: "crypto",
          timestampUtc: "2023-04-29 18:44:00.000000",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      transaction: {
        id: expect.any(Number),
        userId: "u1",
        startCurrencyName: "USD",
        startCurrencyAmount: 2000,
        startCurrencyType: "fiat",
        endCurrencyName: "BTC",
        endCurrencyAmount: 0.1,
        endCurrencyType: "crypto",
        timestampUtc: "2023-04-29 18:44:00.000000",
      },
    });
  });

  test("unauth for different user", async function () {
    const resp = await request(app)
          .post(`/transactions`)
          .send({
            userId: "u1",
            startCurrencyName: "USD",
            startCurrencyAmount: 2000,
            startCurrencyType: "fiat",
            endCurrencyName: "BTC",
            endCurrencyAmount: 0.1,
            endCurrencyType: "crypto",
            timestampUtc: "2023-04-29 18:44:00.000000",
          })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post(`/transactions`)
        .send({
            userId: "u1",
            startCurrencyName: "USD",
            startCurrencyAmount: 2000,
            startCurrencyType: "fiat",
            endCurrencyName: "BTC",
            endCurrencyAmount: 0.1,
            endCurrencyType: "crypto",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post(`/transactions`)
        .send({
            userId: "u1",
            startCurrencyName: "USD",
            startCurrencyAmount: "not-a-number",
            startCurrencyType: "fiat",
            endCurrencyName: "BTC",
            endCurrencyAmount: 0.1,
            endCurrencyType: "crypto",
            timestampUtc: "2023-04-29 18:44:00.000000",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

});

/************************************** GET /transactions */

describe("GET /transactions", function () {
  test("works if same user", async function () {
    const resp = await request(app).get(`/transactions`).set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
          transactions: [
            {
                id: expect.any(Number),
                userId: "u1",
                startCurrencyName: "USD",
                startCurrencyAmount: 2000,
                startCurrencyType: "fiat",
                endCurrencyName: "BTC",
                endCurrencyAmount: 0.1,
                endCurrencyType: "crypto",
                timestampUtc: "2023-04-29 18:44:00.000000",
            },
          ],
        },
    );
  });
});

/************************************** GET /transactions/:id */

describe("GET /transactions/:id", function () {
  test("works if same user", async function () {
    const resp = await request(app).get(`/transactions/1`).set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      transaction: {
        id: 1,
        userId: "u1",
        startCurrencyName: "USD",
        startCurrencyAmount: 2000,
        startCurrencyType: "fiat",
        endCurrencyName: "BTC",
        endCurrencyAmount: 0.1,
        endCurrencyType: "crypto",
        timestampUtc: "2023-04-29 18:44:00.000000",
      },
    });
  });

  test("not found for no such transaction", async function () {
    const resp = await request(app).get(`/transactions/0`).set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});