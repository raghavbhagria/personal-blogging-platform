<?php
require '../../config/database.php';
require '../../config/jwt.php';

header("Content-Type: application/json");

// ✅ Step 1: Get JWT Token from Header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? trim($headers['Authorization']) : '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$token = $matches[1];

try {
    $userData = JWTHandler::validateToken($token); // ✅ Decode JWT Token
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid session"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? null;

if (!$name || !$email) {
    echo json_encode(["status" => "error", "message" => "Name and email are required"]);
    exit;
}

// ✅ Step 2: Update User Info in Database
if ($password) {
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?");
    $stmt->execute([$name, $email, $hashedPassword, $userData['id']]);
} else {
    $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
    $stmt->execute([$name, $email, $userData['id']]);
}

echo json_encode(["status" => "success", "message" => "Profile updated"]);
