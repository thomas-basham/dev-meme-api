#!/bin/bash

# Script to copy a hosted db to another hosted db
# Easiest to have both db's to have the same password

pg_dump -h source_host -U username source_database_name | psql -h target_host -U username new_database_name
# pg_dump -h memes-db.cshqeo8069nq.us-east-1.rds.amazonaws.com -U postgres meme_gallery | psql -h db.owggucigiyipfclhecev.supabase.co -U postgres postgres