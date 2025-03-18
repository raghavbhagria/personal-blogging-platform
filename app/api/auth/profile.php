<?php
require '../../config/database.php';
require '../../config/jwt.php'; // Ensure JWTHandler class is included

header("Content-Type: application/json");

// Get JWT token from the request
$headers = getallheaders(); // More reliable than apache_request_headers()
$authHeader = isset($headers['Authorization']) ? trim($headers['Authorization']) : '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$token = $matches[1];

try {
    $userData = JWTHandler::validateToken($token); // Decode token
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid session", "error" => $e->getMessage()]);
    exit;
}

// Fetch user details from the database
$stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE id = ?");
$stmt->execute([$userData['id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode(["status" => "success", "user" => $user]);
} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "User not found"]);
}
?>