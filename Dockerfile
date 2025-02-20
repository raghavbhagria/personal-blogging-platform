# Use an official PHP image with Apache
FROM php:8.2-apache

# Install required PHP extensions and dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    zip \
    git \
    && docker-php-ext-install pdo pdo_mysql

# Enable Apache modules
RUN a2enmod rewrite
RUN a2enmod headers  # Fix for .htaccess 'Header' error

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory inside the container
WORKDIR /var/www/html

# Copy Composer files first for caching efficiency
COPY backend/composer.json backend/composer.lock /var/www/html/

# Ensure the vendor directory exists and is writable
RUN mkdir -p /var/www/html/vendor && chmod -R 777 /var/www/html/vendor

# Install PHP dependencies inside the container
RUN composer install --no-dev --prefer-dist --no-interaction --working-dir=/var/www/html

# Copy all backend files after dependencies are installed
COPY backend/ /var/www/html/

# Expose port 80
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]
