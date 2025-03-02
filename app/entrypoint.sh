#!/bin/sh

# Run the original entrypoint script
docker-php-entrypoint apache2-foreground &

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until mysqladmin ping -h mysql-db --silent; do
  sleep 1
done

# Run the seed script
echo "Seeding admin user..."
php /var/www/html/db/seed_admin.php

# Keep the container running
wait