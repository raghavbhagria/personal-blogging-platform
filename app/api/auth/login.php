<?php
require '../../config/database.php';
require '../../config/jwt.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? null;
    $password = $_POST['password'] ?? null;

    if (!$email || !$password) {
        echo json_encode(["status" => "error", "message" => "Email and password are required."]);
        exit;
    }

    // Get user from database
    $stmt = $pdo->prepare("SELECT id, name, email, password, isAdmin FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
        exit;
    }

    // Generate JWT token
    $token = JWTHandler::generateToken($user['id'], $user['email']);

    echo json_encode([
        "status" => "success",
        "token" => $token,
        "user" => [
            "id" => $user['id'],
            "name" => $user['name'],
            "email" => $user['email'],
            "isAdmin" => $user['isAdmin']
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>