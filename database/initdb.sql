CREATE EXTENSION dblink;

-- Check if databases already exists
DO
$do$
BEGIN
   IF EXISTS (SELECT 1 FROM pg_database WHERE datname = 'dev_letseat') THEN
      RAISE NOTICE 'Database already exists';
   ELSE
      PERFORM dblink_exec('dbname=' || current_database()  -- current db
                        , 'CREATE DATABASE dev_letseat');
   END IF;
END
$do$;
GRANT ALL PRIVILEGES ON DATABASE dev_letseat TO postgres;

DO
$do$
BEGIN
   IF EXISTS (SELECT 1 FROM pg_database WHERE datname = 'test_letseat') THEN
      RAISE NOTICE 'Database already exists';
   ELSE
      PERFORM dblink_exec('dbname=' || current_database()  -- current db
                        , 'CREATE DATABASE test_letseat');
   END IF;
END
$do$;
GRANT ALL PRIVILEGES ON DATABASE test_letseat TO postgres;