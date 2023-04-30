"use strict";

/** Shared config for application; can be required many places. */

const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
require("colors");

const clientVals = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3000;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  let DB_URI = `postgresql://`;

  if (process.env.NODE_ENV === "test") {
    DB_URI = `${DB_URI}/cryptoapp-test`;
  } else {
    DB_URI = process.env.DATABASE_URL || `${DB_URI}/cryptoapp`;
  }
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("CryptoApp Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  clientVals,
};
