<?php
require '../../config/database.php';
require '../../config/jwt.php';

header("Content-Type: application/json");

// ✅ Step 1: Get JWT Token from Header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? trim($headers['Authorization']) : '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$token = $matches[1];

try {
    $userData = JWTHandler::validateToken($token); // ✅ Decode JWT Token
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid session"]);
    exit;
}

// Fetch current user details from the database
$stmt = $pdo->prepare("SELECT name, email, profile_image FROM users WHERE id = ?");
$stmt->execute([$userData['id']]);
$currentUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$currentUser) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

$name = trim($_POST['name'] ?? $currentUser['name']);
$email = trim($_POST['email'] ?? $currentUser['email']);
$password = $_POST['password'] ?? null;

// Image Upload Handling
$profile_image = $currentUser['profile_image']; // Default to current profile image

// Check if a file has been uploaded
if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
    // Validate file size (max 2MB for example)
    if ($_FILES['profile_image']['size'] > 2 * 1024 * 1024) {
        echo json_encode(["status" => "error", "message" => "File size exceeds 2MB."]);
        exit;
    }

    // Validate file type (only JPG, PNG, GIF)
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    $fileType = mime_content_type($_FILES['profile_image']['tmp_name']);
    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode(["status" => "error", "message" => "Invalid file type. Only JPG, PNG, and GIF are allowed."]);
        exit;
    }

    // Set the upload directory
    $uploadDir = '../../uploads/';
    $uploadFile = $uploadDir . basename($_FILES['profile_image']['name']);
    
    // Move the uploaded file
    if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $uploadFile)) {
        $profile_image = basename($uploadFile);  // Store the filename (relative to the uploads directory)
        error_log("Profile image uploaded to: " . realpath($uploadFile));
    } else {
        echo json_encode(["status" => "error", "message" => "Image upload failed."]);
        exit;
    }
}

// Ensure name and email are present
if (!$name || !$email) {
    echo json_encode(["status" => "error", "message" => "Name and email are required"]);
    exit;
}

// ✅ Step 2: Update User Info in Database
if ($password) {
    // If the password is being updated, hash it
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, password = ?, profile_image = ? WHERE id = ?");
    $stmt->execute([$name, $email, $hashedPassword, $profile_image, $userData['id']]);
} else {
    // If no password change, just update name, email, and profile image
    $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, profile_image = ? WHERE id = ?");
    $stmt->execute([$name, $email, $profile_image, $userData['id']]);
}

echo json_encode(["status" => "success", "message" => "Profile updated"]);
?>
