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

$id = $_POST['id'] ?? null;
$status = $_POST['status'] ?? null;

if (!$id || $status === null) {
    echo json_encode(["status" => "error", "message" => "User ID and status are required."]);
    exit;
}

$stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
if ($stmt->execute([$status, $id])) {
    echo json_encode(["status" => "success", "message" => "User status updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update user status."]);
}
?>