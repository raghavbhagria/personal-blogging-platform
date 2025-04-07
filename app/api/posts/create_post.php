<?php
session_start();
require '../../config/database.php';

header("Content-Type: application/json");

// ✅ Check if user is logged in via session
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized. Please log in."]);
    exit;
}

$user_id = $_SESSION['user_id'];

$title = $_POST['title'] ?? null;
$content = $_POST['content'] ?? null;
$category = $_POST['category'] ?? null;
$tags = $_POST['tags'] ?? null;

if (!$title || !$content || !$category) {
    echo json_encode(["status" => "error", "message" => "Title, content, and category are required."]);
    exit;
}

// ✅ Verify user exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["status" => "error", "message" => "User not found."]);
    exit;
}

// ✅ Image upload handling
$image_path = null;

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../../../uploads/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileTmp = $_FILES['image']['tmp_name'];
    $fileName = basename($_FILES['image']['name']);
    $uploadFile = $uploadDir . $fileName;

    if (move_uploaded_file($fileTmp, $uploadFile)) {
        $image_path = $fileName;
        error_log("✅ Post image uploaded to: " . realpath($uploadFile));
    } else {
        echo json_encode(["status" => "error", "message" => "Image upload failed."]);
        exit;
    }
}

try {
    $stmt = $pdo->prepare("INSERT INTO posts (user_id, title, content, category, tags, image_path) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $title, $content, $category, $tags, $image_path]);

    echo json_encode(["status" => "success", "message" => "Post created successfully!"]);
} catch (PDOException $e) {
    error_log("❌ Post creation error: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Failed to create post."]);
}
?>
