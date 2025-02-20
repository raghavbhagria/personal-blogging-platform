<?php

$host = 'mysql-db'; // Make sure this matches the MySQL service name in docker-compose.yml
$dbname = 'blogging_platform';
$username = 'user';
$password = 'userpassword';

try {
    $pdo = new PDO("mysql:host=$host;port=3306;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

?>
