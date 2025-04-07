<?php
session_start();
require '../../config/database.php';
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['email']) || !isset($input['password'])) {
    echo json_encode(["status" => "error", "message" => "Email and password are required."]);
    exit;
}

$email = trim($input['email']);
$password = trim($input['password']);

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

// ✅ Login successful — set session
$_SESSION['user_id'] = $user['id'];
$_SESSION['is_admin'] = $user['isAdmin'];

echo json_encode(["status" => "success", "user" => [
    "id" => $user['id'],
    "name" => $user['name'],
    "email" => $user['email'],
    "isAdmin" => $user['isAdmin']
]]);
?>
