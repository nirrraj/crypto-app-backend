"use strict";

const { Client } = require("pg");
const { clientVals } = require("./config");

let db = new Client(clientVals);

/*let db = new Client({
  connectionString: "getDatabaseUri()",
  ssl: {
    rejectUnauthorized: false
  }
});*/


db.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch(err => {
    console.error('Failed to connect to PostgreSQL database', err);
  });

module.exports = db;