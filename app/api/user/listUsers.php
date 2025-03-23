<?php
require '../../config/database.php';
require '../../middleware/auth.php';

header("Content-Type: application/json");

$user = authenticate();

if (!$user['isAdmin']) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Access denied"]);
    exit;
}

$stmt = $pdo->query("SELECT id, name, email, isAdmin, status FROM users");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["status" => "success", "users" => $users]);
?>