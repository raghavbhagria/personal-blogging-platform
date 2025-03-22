<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
</head>
<body>
    <h2>Register</h2>
    <form action="/api/auth/register.php" method="POST" enctype="multipart/form-data">
        <input type="text" name="name" placeholder="Full Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="file" name="profile_image" accept="image/*">
        <button type="submit">Register</button>
    </form>
</body>
</html>

<?php
require '../../config/database.php';

header("Content-Type: application/json");

$name = $_POST['name'] ?? null;
$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;

// Image Upload Handling
$profile_image = null; // Default value

if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../../uploads/'; // Create this directory
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

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO users (name, email, password, profile_image) VALUES (?, ?, ?, ?)");
if ($stmt->execute([$name, $email, $hashed_password, $profile_image])) {
    echo json_encode(["status" => "success", "message" => "Registration successful"]);
} else {
    echo json_encode(["status" => "error", "message" => "Registration failed"]);
}
?>
