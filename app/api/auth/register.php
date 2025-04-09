<?php
require '../../config/database.php';
header("Content-Type: application/json");

$name = $_POST['name'] ?? null;
$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;

// Image Upload Handling
$profile_image = null; // Default value

if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../../frontend/uploads/';

    $uploadFile = $uploadDir . basename($_FILES['profile_image']['name']);

    if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $uploadFile)) {
        $profile_image = basename($uploadFile); // Store just the filename
    } else {
        // Handle upload error (e.g., insufficient permissions)
        echo json_encode(["status" => "error", "message" => "Image upload failed."]);
        exit;
    }
}

if (!$name || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    exit;
}

// Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert user into database (isAdmin defaults to 0)
$stmt = $pdo->prepare("INSERT INTO users (name, email, password, profile_image) VALUES (?, ?, ?, ?)");

try {
    $stmt->execute([$name, $email, $hashed_password, $profile_image]);
    echo json_encode(["status" => "success", "message" => "Registration successful!"]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Unique constraint violation (duplicate email)
        echo json_encode(["status" => "error", "message" => "Email is already registered."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Registration failed: " . $e->getMessage()]);
    }
}
?>
