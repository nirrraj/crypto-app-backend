-- both test users have the password "password"

INSERT INTO users (username, password, email, native_fiat_currency)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'test@gmail.com',
        'USD'),
       ('testuser2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'anothertest@hotmail.com',
        'INR');

INSERT INTO watchlists (user_id,crypto_name)
VALUES (1, 'BTC'),
       (1, 'ETH'),
       (2, 'BTC');

INSERT INTO wallets (user_id, currency_name, currency_amount, currency_type)
VALUES (1,'BTC',0.2,'crypto'),
       (1, 'USD', 1234.56, 'fiat'),
       (2,'ETH',3.3,'crypto');

INSERT INTO transactions (user_id,transaction_type,start_currency_name,start_currency_amount,start_currency_type,
end_currency_name,end_currency_amount,end_currency_type,timestamp_utc)
VALUES (1,'deposit',null,null,null,'USD',5234.56,'fiat','2023-04-27 12:59:00.000000'),
        (1,'buy','USD',4000,'fiat','BTC',0.2,'crypto','2023-04-27 18:59:00.000000'),
        (2,'deposit',null,null,null,'ETH',3.3,'crypto','2023-04-273 13:12:00.000000');