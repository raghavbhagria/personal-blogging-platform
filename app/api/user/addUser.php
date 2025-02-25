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

$name = $_POST['name'] ?? null;
$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;
$isAdmin = isset($_POST['isAdmin']) ? (int) $_POST['isAdmin'] : 0; // Ensure integer (0 or 1)

if (!$name || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)");
if ($stmt->execute([$name, $email, $hashed_password, $isAdmin])) {
    echo json_encode(["status" => "success", "message" => "User added successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error adding user"]);
}
?>
