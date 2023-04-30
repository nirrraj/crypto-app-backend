CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
    CHECK (position('@' IN email) > 1),
  native_fiat_currency TEXT NOT NULL
);

CREATE TABLE watchlists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL
    REFERENCES users ON DELETE CASCADE,
  crypto_name TEXT NOT NULL
);

CREATE TABLE wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL
    REFERENCES users ON DELETE CASCADE,
  currency_name TEXT NOT NULL,
  currency_amount DECIMAL NOT NULL,
  currency_type TEXT NOT NULL
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL
    REFERENCES users ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  start_currency_name TEXT,
  start_currency_amount DECIMAL,
  start_currency_type TEXT,
  end_currency_name TEXT,
  end_currency_amount DECIMAL,
  end_currency_type TEXT,
  timestamp_utc TIMESTAMP NOT NULL
);