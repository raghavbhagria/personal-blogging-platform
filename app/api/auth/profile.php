<?php
require '../../config/database.php';
require '../../config/jwt.php'; // Ensure JWTHandler class is included

header("Content-Type: application/json");

// Get JWT token from the request
$headers = apache_request_headers();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$token = $matches[1];
$userData = JWTHandler::validateToken($token);

if (!$userData) {
    echo json_encode(["status" => "error", "message" => "Invalid session"]);
    exit;
}

// Fetch user details from the database
$stmt = $pdo->prepare("SELECT name, email FROM users WHERE id = ?");
$stmt->execute([$userData['id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode(["status" => "success", "user" => $user]);
} else {
    echo json_encode(["status" => "error", "message" => "User not found"]);
}
?>
