

# Personal Blogging Platform

## Project Overview
This is a personal blogging platform built with **PHP, MySQL, JavaScript, and Docker**. Users can register, log in, create posts, and view profiles.

---

## Getting Started

### Clone the Repository
```sh
git clone https://github.com/YOUR_USERNAME/personal-blogging-platform.git
cd personal-blogging-platform
```

### Install Dependencies
Ensure you have **Docker & Docker Compose** installed.

- Check Docker version:
```sh
docker -v
```
- Check Docker Compose version:
```sh
docker-compose -v
```

---

## Setting Up the Project

### Start the Containers
```sh
docker-compose up --build
```
- This will start **PHP (Apache), MySQL, and the frontend**.
- To stop the containers:
```sh
docker-compose down
```

### Verify Setup
- Open **http://localhost:8080** in your browser to access the blogging platform.

---

## Project Structure
```
├── app/                  # Main application folder
│   ├── api/              # Backend API (PHP)
│   ├── config/           # Database and configuration files
│   ├── db/               # Database initialization scripts
│   ├── frontend/         # HTML, CSS, JavaScript
│   ├── models/           # Data models
│   ├── views/            # Page templates
├── docker-compose.yml    # Docker configuration
├── Dockerfile            # PHP-Apache container setup
└── README.md             # Project documentation (this file)
```

---

## Database Setup
The MySQL container will automatically create the required database and seed it with initial data.

- Connect to MySQL inside the container:
```sh
docker exec -it mysql-db mysql -u user -p
```
(Enter password when prompted)

- Check databases and tables:
```sql
SHOW DATABASES;
USE blogging_platform;
SHOW TABLES;
```

---

## Admin Account Access
Since the database is auto-seeded, an admin account is already created.

- Go to: **http://localhost:8080**
- Admin Login:
  - email: `admin@example.com`
  - Password: `adminpassword`

Use this account to access the admin dashboard.

---

## Reset and Rebuild Everything
If anything breaks or you want a fresh start:

```sh
docker-compose down -v
docker-compose up --build
```

This ensures volumes are removed, so MySQL gets a fresh database with seeded data.

