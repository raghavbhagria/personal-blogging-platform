
# Personal Blogging Platform

## Project Overview
This is a personal blogging platform built with **PHP, MySQL, JavaScript**. Users can register, log in, create posts, and view profiles.

---

## Getting Started

### Clone the Repository
```sh
git clone https://github.com/YOUR_USERNAME/personal-blogging-platform.git
cd personal-blogging-platform
```

### Install XAMPP
Ensure you have **XAMPP** installed.

1. Install XAMPP based on your operating system.
2. Open the **XAMPP Control Panel** and start **Apache** and **MySQL** services.

---

## Setting Up the Project

### 1. Database Setup in XAMPP

1. Open **phpMyAdmin** in your browser by navigating to `http://localhost/phpmyadmin/`.
2. Create a new database for the project, e.g., `blogging_platform`.
3. Import the `db/schema.sql` file (if available) into the database to create the necessary tables.

###  2. Import Database

1. Open **phpMyAdmin** by navigating to `http://localhost/phpmyadmin/` in your browser.
2. Create a new database for the project (e.g., `blogging_platform`).
3. Select the newly created database, then click on the **Import** tab.
4. In the **File to Import** section, click **Choose File** and select the `init.sql` file located in the root directory of the project.
5. Click **Go** to import the database structure into MySQL.

This will create all the necessary tables for the application to function properly.




### 3. Verify Setup

- Once you’ve set up the database and configured your credentials, navigate to `http://localhost/personal-blogging-platform/` in your browser to access the blogging platform.

---

## Project Structure
```
├── index.php
├── app/                  # Main application folder
│   ├── api/              # Backend API (PHP)
│   ├── config/           # Database and configuration files
│   ├── db/               # Database initialization scripts
│   ├── frontend/         # HTML, CSS, JavaScript
│   ├── models/           # Data models
│   ├── views/            # Page templates
|   ├── uploads/              # User uploads (profile pictures, etc.)
├── README.md             # Project documentation (this file)
```

---

## Admin Account Access
Since the database is auto-seeded, an admin account is already created.

- Go to: **http://localhost/personal-blogging-platform/**
- Admin Login:
  - email: `admin@example.com`
  - Password: `adminpassword`

Use this account to access the admin dashboard.

---

## Reset and Rebuild Everything

If anything breaks or you want a fresh start:

1. Delete the `blogging_platform` database from **phpMyAdmin**.
2. Recreate the database and re-import the 'init.sql' file (if available).
3. Restart Apache and MySQL in **XAMPP** and verify by visiting **http://localhost/personal-blogging-platform/**.

---

## Notes



To ensure the application can write to the `uploads` directory, you'll need to set the correct permissions.

1. Open your terminal and navigate to the root of your project directory.
2. Run the following command to give write permissions to the `uploads` folder:

   For Linux/macOS:
   ```sh
   sudo chmod -R 775 app/uploads


