<?php
require '../../config/database.php';
require '../../middleware/auth.php';

header("Content-Type: application/json"); // Ensure response is JSON

$user = authenticate();

if (!$user['isAdmin']) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Access denied"]);
    exit;
}

$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? null;
$email = $_POST['email'] ?? null;
$isAdmin = isset($_POST['isAdmin']) ? (int) $_POST['isAdmin'] : 0; // Ensure integer (0 or 1)

if (!$id || !$name || !$email) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

$stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, isAdmin = ? WHERE id = ?");
if ($stmt->execute([$name, $email, $isAdmin, $id])) {
    echo json_encode(["status" => "success", "message" => "User updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error updating user"]);
}
?>
