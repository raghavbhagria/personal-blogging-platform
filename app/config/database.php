<?php
$host = '127.0.0.1'; // ✅ or localhost
$dbname = 'blogging_platform';
$username = 'root';
$password = ''; // ✅ XAMPP default

try {
    $pdo = new PDO("mysql:host=$host;port=3306;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
