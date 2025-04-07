<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require '../../config/database.php';
header("Content-Type: application/json");

// ✅ Step 1: Check Session
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized - not logged in"]);
    exit;
}

// ✅ Step 2: Fetch current user info
$stmt = $pdo->prepare("SELECT name, email, profile_image FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$currentUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$currentUser) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

$name = trim($_POST['name'] ?? $currentUser['name']);
$email = trim($_POST['email'] ?? $currentUser['email']);
$password = $_POST['password'] ?? null;

echo json_encode($_FILES);
exit;


$profile_image = $currentUser['profile_image']; // default to existing

if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = realpath(__DIR__ . '/../../../uploads'); // Absolute path

    if (!$uploadDir) {
        error_log("Upload directory does not exist or is invalid.");
        echo json_encode(["status" => "error", "message" => "Upload directory not found."]);
        exit;
    }

    if (!is_writable($uploadDir)) {
        error_log("Upload directory is not writable.");
        echo json_encode(["status" => "error", "message" => "Server error: Upload directory is not writable."]);
        exit;
    }

    $fileTmp = $_FILES['profile_image']['tmp_name'];
    $fileName = basename($_FILES['profile_image']['name']);
    $targetPath = $uploadDir . DIRECTORY_SEPARATOR . $fileName;

    error_log("Trying to move file from $fileTmp to $targetPath");

    if (move_uploaded_file($fileTmp, $targetPath)) {
        $profile_image = $fileName;
        error_log("✅ File uploaded successfully!");
    } else {
        error_log("❌ move_uploaded_file failed.");
        echo json_encode(["status" => "error", "message" => "Image upload failed."]);
        exit;
    }
}




// ✅ Step 3: Update User Info
if (!$name || !$email) {
    echo json_encode(["status" => "error", "message" => "Name and email are required"]);
    exit;
}

if ($password) {
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, password = ?, profile_image = ? WHERE id = ?");
    $stmt->execute([$name, $email, $hashedPassword, $profile_image, $_SESSION['user_id']]);
} else {
    $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, profile_image = ? WHERE id = ?");
    $stmt->execute([$name, $email, $profile_image, $_SESSION['user_id']]);
}

echo json_encode(["status" => "success", "message" => "Profile updated"]);
?>
