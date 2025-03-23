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

$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;

if (!$email) {
    echo json_encode(["status" => "error", "message" => "Email is required."]);
    exit;
}

try {
    // Check if the email already exists for another admin
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->execute([$email, $user['id']]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "error", "message" => "Email is already in use by another admin."]);
        exit;
    }

    // Update admin details
    if ($password) {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE users SET email = ?, password = ? WHERE id = ?");
        $stmt->execute([$email, $hashedPassword, $user['id']]);
    } else {
        $stmt = $pdo->prepare("UPDATE users SET email = ? WHERE id = ?");
        $stmt->execute([$email, $user['id']]);
    }

    echo json_encode(["status" => "success", "message" => "Admin details updated successfully."]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to update admin details", "details" => $e->getMessage()]);
}
?> 