# Use an official PHP image with Apache
FROM php:8.2-apache

# Install required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite (for friendly URLs if needed)
RUN a2enmod rewrite

# Set the working directory inside the container
WORKDIR /var/www/html

# Copy all backend files to the container
COPY backend/ /var/www/html/

# Expose port 80 (Apache default)
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]
