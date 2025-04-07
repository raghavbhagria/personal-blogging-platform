<?php
// 🔧 Error reporting for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require '../../config/database.php';
header("Content-Type: application/json");

// ✅ Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in."]);
    exit;
}

// ✅ Fetch current user from DB
$stmt = $pdo->prepare("SELECT name, email, profile_image FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$currentUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$currentUser) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

// ✅ Get form data
$name = trim($_POST['name'] ?? $currentUser['name']);
$email = trim($_POST['email'] ?? $currentUser['email']);
$password = $_POST['password'] ?? null;

// ✅ Start with existing image as fallback
$profile_image = $currentUser['profile_image'];

// ✅ Handle image upload (if provided)
if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../../../uploads/';

    // Create uploads folder if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileTmp = $_FILES['profile_image']['tmp_name'];
    $fileName = basename($_FILES['profile_image']['name']);
    $targetPath = $uploadDir . $fileName;

    error_log("Trying to move file from $fileTmp to $targetPath");

    if (move_uploaded_file($fileTmp, $targetPath)) {
        $profile_image = $fileName;
        error_log("✅ File uploaded successfully: $profile_image");
    } else {
        error_log("❌ move_uploaded_file failed");
        echo json_encode(["status" => "error", "message" => "Image upload failed."]);
        exit;
    }
}

// ✅ Basic validation
if (!$name || !$email) {
    echo json_encode(["status" => "error", "message" => "Name and email are required"]);
    exit;
}

try {
    // ✅ Update user info in DB
    if ($password) {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, password = ?, profile_image = ? WHERE id = ?");
        $stmt->execute([$name, $email, $hashedPassword, $profile_image, $_SESSION['user_id']]);
    } else {
        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, profile_image = ? WHERE id = ?");
        $stmt->execute([$name, $email, $profile_image, $_SESSION['user_id']]);
    }

    echo json_encode(["status" => "success", "message" => "Profile updated"]);
} catch (Exception $e) {
    error_log("❌ Exception during update: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Profile update failed", "error" => $e->getMessage()]);
}
?>
