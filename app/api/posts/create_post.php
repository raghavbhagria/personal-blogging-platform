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

$title = $_POST['title'] ?? null;
$content = $_POST['content'] ?? null;

if (!$title || !$content) {
    echo json_encode(["status" => "error", "message" => "Title and content are required."]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)");
    $stmt->execute([$user['id'], $title, $content]);
    echo json_encode(["status" => "success", "message" => "Post created successfully!"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Failed to create post: " . $e->getMessage()]);
}
?>