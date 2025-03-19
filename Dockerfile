# Use an official PHP image with Apache
FROM php:8.2-apache

# Install required PHP extensions and default-mysql-client
RUN apt-get update && apt-get install -y unzip zip git default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql

# Enable Apache modules
RUN a2enmod rewrite
RUN a2enmod headers

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory inside the container
WORKDIR /var/www/html

# Copy the entire app folder (backend + frontend)
COPY app/ /var/www/html/

# Ensure frontend assets are copied properly
COPY app/frontend/js/ /var/www/html/frontend/js/
COPY app/frontend/assets/ /var/www/html/frontend/assets/

# Ensure composer dependencies are installed
WORKDIR /var/www/html
RUN composer install --no-dev --prefer-dist

# Set home.html as default index
RUN rm -f /var/www/html/index.html && ln -s /var/www/html/frontend/pages/home.html /var/www/html/index.html

# Ensure correct permissions
RUN chmod -R 755 /var/www/html

# Copy custom Apache config
COPY app/apache-config.conf /etc/apache2/sites-available/000-default.conf

# Copy the custom entrypoint script
COPY app/entrypoint.sh /usr/local/bin/entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 80
EXPOSE 80

# Use the custom entrypoint script
ENTRYPOINT ["/bin/sh", "/usr/local/bin/entrypoint.sh"]