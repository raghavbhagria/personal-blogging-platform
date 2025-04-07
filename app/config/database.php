<?php
$host = '127.0.0.1'; // or 'localhost'
$dbname = 'raghav49'; // your actual database name
$username = 'raghav49'; // your MySQL username (same as CWL)
$password = 'raghav49'; // your MySQL password (same as CWL)

try {
    $pdo = new PDO("mysql:host=$host;port=3306;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
