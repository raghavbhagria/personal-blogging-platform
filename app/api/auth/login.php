<?php
require '../../config/database.php';
require '../../config/jwt.php';
header("Content-Type: application/json");

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['email']) || !isset($input['password'])) {
    echo json_encode(["status" => "error", "message" => "Email and password are required."]);
    exit;
}

$email = trim($input['email']);
$password = trim($input['password']);

// Fetch user from database
$stmt = $pdo->prepare("SELECT id, name, email, password, isAdmin, status FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
    exit;
}

if (!$user['status']) {
    echo json_encode(["status" => "error", "message" => "Your account has been disabled by the admin."]);
    exit;
}

// Generate JWT token
$token = JWTHandler::generateToken($user['id'], $user['email'], $user['isAdmin']);

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
?>