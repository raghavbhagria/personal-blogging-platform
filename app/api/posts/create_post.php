<?php
require '../../config/database.php';
require '../../config/jwt.php';

header("Content-Type: application/json");

$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? trim($headers['Authorization']) : '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$token = $matches[1];

try {
    $userData = JWTHandler::validateToken($token);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid session"]);
    exit;
}

$title = $_POST['title'] ?? null;
$content = $_POST['content'] ?? null;
$category = $_POST['category'] ?? null;
$tags = $_POST['tags'] ?? null;

if (!$title || !$content || !$category) {
    echo json_encode(["status" => "error", "message" => "Title, content, and category are required"]);
    exit;
}

// Verify that the user exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
$stmt->execute([$userData['id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

// Image Upload Handling
$image_path = null;

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../../uploads/';
    $uploadFile = $uploadDir . basename($_FILES['image']['name']);

    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
        $image_path = basename($uploadFile);
        // Log the full path of the uploaded image
        error_log("Post image uploaded to: " . realpath($uploadFile));
    } else {
        echo json_encode(["status" => "error", "message" => "Image upload failed."]);
        exit;
    }
}

try {
    $stmt = $pdo->prepare("INSERT INTO posts (user_id, title, content, category, tags, image_path) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$userData['id'], $title, $content, $category, $tags, $image_path]);
    echo json_encode(["status" => "success", "message" => "Post created successfully!"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Failed to create post: " . $e->getMessage()]);
}
?>