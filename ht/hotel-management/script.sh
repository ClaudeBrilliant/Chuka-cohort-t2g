#!/bin/bash

echo " Setting up Hotel Management DB....."

# Create database
psql -U postgres -h localhost -c "CREATE DATABASE hotel_management;"

# Run migrations 
psql -U postgres -h localhost -d hotel_management -f src/database/migrations/001_initial_schema.sql

# CREATE stored procedures
psql -U postgres -h localhost -d hotel_management -f src/database/procedures/sp_create_user.sql
psql -U postgres -h localhost -d hotel_management -f src/database/procedures/sp_get_users.sql
psql -U postgres -h localhost -d hotel_management -f src/database/procedures/sp_update_user.sql
psql -U postgres -h localhost -d hotel_management -f src/database/procedures/sp_delete_user.sql



echo "DATABASE setup complete..."

echo " You can now run : npm run start:dev"