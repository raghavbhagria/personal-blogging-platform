<?php
require '../../config/database.php';
header("Content-Type: application/json");

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['name']) || !isset($input['email']) || !isset($input['password'])) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

$name = trim($input['name']);
$email = trim($input['email']);
$password = trim($input['password']);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    exit;
}

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert user into database (isAdmin defaults to 0)
$stmt = $pdo->prepare("INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, 0)");

try {
    $stmt->execute([$name, $email, $hashedPassword]);
    echo json_encode(["status" => "success", "message" => "Registration successful!"]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Unique constraint violation (duplicate email)
        echo json_encode(["status" => "error", "message" => "Email is already registered."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Registration failed: " . $e->getMessage()]);
    }
}
?>
