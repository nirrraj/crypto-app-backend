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

/************************************** POST /wallets */

describe("POST /wallets", function () {
  test("works if same user", async function () {
    const resp = await request(app)
        .post(`/wallets`)
        .send({
          userId: "u1",
          currencyName: "BTC",
          currencyAmount: 0.1,
          currencyType: "crypto",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      wallet: {
        id: expect.any(Number),
        userId: "u1",
        currencyName: "BTC",
        currencyAmount: 0.1,
        currencyType: "crypto",
      },
    });
  });

  test("unauth for different user", async function () {
    const resp = await request(app)
          .post(`/wallets`)
          .send({
            userId: "u1",
            currencyName: "BTC",
            currencyAmount: 0.1,
            currencyType: "crypto",
          })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post(`/wallets`)
        .send({
          userId: "u1",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post(`/wallets`)
        .send({
          userId: "u1",
          currencyName: "BTC",
          currencyAmount: "not-a-number",
          currencyType: "crypto",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

});

/************************************** GET /wallets */

describe("GET /wallets", function () {
  test("works if same user", async function () {
    const resp = await request(app).get(`/wallets`).set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
          wallets: [
            {
              id: expect.any(Number),
              userId: "u1",
              currencyName: "BTC",
              currencyAmount: 0.1,
              currencyType: "crypto",
            },
          ],
        },
    );
  });
});

/************************************** GET /wallets/:id */

describe("GET /wallets/:id", function () {
  test("works if same user", async function () {
    const resp = await request(app).get(`/wallets/1`).set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      wallet: {
        id: 1,
        userId: "u1",
        currencyName: "BTC",
        currencyAmount: 0.1,
        currencyType: "crypto",
      },
    });
  });

  test("not found for no such wallet", async function () {
    const resp = await request(app).get(`/wallets/0`).set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /wallets/:id */

describe("PATCH /wallets/:id", function () {

  test("unauth for other user", async function () {
    const resp = await request(app)
        .patch(`/wallets/1`)
        .send({
          currencyAmount: 100,
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such wallet", async function () {
    const resp = await request(app)
        .patch(`/wallets/0`)
        .send({
          currencyAmount: 100,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on id change attempt", async function () {
    const resp = await request(app)
        .patch(`/wallets/1`)
        .send({
          id: 10,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .patch(`/wallets/1`)
        .send({
          currencyAmount: "not-a-number",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /wallets/:id */

describe("DELETE /wallet/:id", function () {
  test("unauth for other user", async function () {
    const resp = await request(app)
        .delete(`/wallets/1`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/wallets/1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such wallet", async function () {
    const resp = await request(app)
        .delete(`/wallets/0`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});