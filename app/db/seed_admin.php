<?php
require __DIR__ . '/../config/database.php';

$adminName = 'Admin';
$adminEmail = 'admin@example.com';
$adminPassword = 'adminpassword';
$hashedPassword = password_hash($adminPassword, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, 1)");
    $stmt->execute([$adminName, $adminEmail, $hashedPassword]);
    echo "Admin user seeded successfully.";
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Unique constraint violation (duplicate email)
        echo "Admin user already exists.";
    } else {
        echo "Error seeding admin user: " . $e->getMessage();
    }
}
?>