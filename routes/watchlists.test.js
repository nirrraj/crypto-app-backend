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

/************************************** POST /watchlists */

describe("POST /watchlists", function () {
  const newWatchlist = {
    userId: "u1",
    cryptoName: "XRP",
  };

  test("unauth for other user", async function () {
    const resp = await request(app)
        .post("/watchlists")
        .send(newWatchlist)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/watchlists")
        .send({
          userId: "u1",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/watchlists")
        .send({
          userId: "u1",
          cryptoName: 0,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /watchlists */

describe("GET /watchlists", function () {
  test("works for correct user", async function () {
    const resp = await request(app).get("/watchlists").set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      watchlists:
          [
            {
              userId: "u1",
              cryptoName: "BTC",
            },
            {
              userId: "u1",
              cryptoName: "ETH",
            },
          ],
    });
  });
});

/************************************** GET /watchlists/:id */

describe("GET /watchlists/:id", function () {
  test("works for same user", async function () {
    const resp = await request(app).get(`/watchlists/1`).set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      watchlist: {
        userId: "u1",
        cryptoName: "BTC",
      },
    });
  });

  test("not found for no such watchlist", async function () {
    const resp = await request(app).get(`/watchlists/nope`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** DELETE /watchlists/:id */

describe("DELETE /watchlists/:id", function () {
  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/watchlists/1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such watchlist", async function () {
    const resp = await request(app)
        .delete(`/watchlists/nope`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});