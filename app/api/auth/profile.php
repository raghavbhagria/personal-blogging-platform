<?php
session_start();
require '../../config/database.php';

header("Content-Type: application/json");

// Check if the user is logged in via session
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized - not logged in"]);
    exit;
}

// Fetch user details from the database
$stmt = $pdo->prepare("SELECT id, name, email, profile_image FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode(["status" => "success", "user" => $user]);
} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "User not found"]);
}
?>
