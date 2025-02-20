<?php
require '../config/jwt.php';
header("Content-Type: application/json");

$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    echo json_encode(["status" => "error", "message" => "Authorization token required."]);
    exit;
}

$token = str_replace("Bearer ", "", $headers['Authorization']);
$userData = JWTHandler::validateToken($token);

if (!$userData) {
    echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    exit;
}

echo json_encode([
    "status" => "success",
    "message" => "You have access!",
    "user" => $userData
]);
?>
