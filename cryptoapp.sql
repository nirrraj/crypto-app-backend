\echo 'Delete and recreate cryptoapp db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE cryptoappdb;
CREATE DATABASE cryptoappdb;
\connect cryptoappdb

\i cryptoapp-schema.sql
\i cryptoapp-seed.sql