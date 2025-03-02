<?php
require '../../config/database.php';
require '../../middleware/auth.php';

header("Content-Type: application/json");

$user = authenticate();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

if (!isset($_FILES['profile_pic'])) {
    echo json_encode(["status" => "error", "message" => "No file uploaded"]);
    exit;
}

$file = $_FILES['profile_pic'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode(["status" => "error", "message" => "Invalid file type"]);
    exit;
}

$uploadDir = '../../uploads/profile_pics/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$filename = $user['id'] . '_' . time() . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
$filepath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $filepath)) {
    $profilePicUrl = '/uploads/profile_pics/' . $filename;

    $stmt = $pdo->prepare("UPDATE users SET profile_pic = ? WHERE id = ?");
    if ($stmt->execute([$profilePicUrl, $user['id']])) {
        echo json_encode(["status" => "success", "profile_pic_url" => $profilePicUrl]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update profile picture in database"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Failed to upload file"]);
}
?>