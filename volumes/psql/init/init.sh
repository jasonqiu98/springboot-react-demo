# create a new database `demo_db`
psql -h db -p 5432 -U postgres -f /opt/sql/create_db.sql

echo "Database `demo_db` created."

# create schema's, tables and insert data
psql -h db -p 5432 -U postgres -d demo_db -f /opt/sql/demo_db.sql

echo "Schema's, tables and data are generated."
