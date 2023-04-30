const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");

  await db.query(`
        INSERT INTO users(username,
                          password,
                          email,
                          native_fiat_currency)
        VALUES ('u1', $1, 'u1@email.com', 'USD'),
               ('u2', $2, 'u2@email.com', 'INR')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);

  await db.query(`
    INSERT INTO watchlists(user_id,crypto_name)
    VALUES (1, 'BTC'),
           (1, 'ETH'),
           (2, 'DOGE')`);
  
  await db.query(`
    INSERT INTO wallets(user_id,currency_name,currency_amount,currency_type)
    VALUES (1, 'USD', 1000, 'fiat'),
           (1, 'BTC', 0.1, 'crypto'),
           (2, 'USD', 2000, 'fiat')`);

  await db.query(`
    INSERT INTO transactions(user_id,transaction_type,start_currency_name,start_currency_amount,start_currency_type,end_currency_name,end_currency_amount,end_currency_type,timestamp_utc)
    VALUES (1, 'buy', 'USD', 2000, 'fiat', 'BTC', 0.1, 'crypto','2023-04-27 21:35:00.000000'),
           ('2', 'sell', 'ETH', 1, 'crypto', 'USD', 2000, 'fiat', '2023-04-24 02:14:00.000000')`);
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


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};