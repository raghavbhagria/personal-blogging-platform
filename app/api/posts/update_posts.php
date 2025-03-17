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

$post_id = $_POST['post_id'] ?? null;
$title = $_POST['title'] ?? null;
$content = $_POST['content'] ?? null;

if (!$post_id || !$title || !$content) {
    echo json_encode(["status" => "error", "message" => "Post ID, title, and content are required."]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE posts SET title = ?, content = ? WHERE id = ? AND user_id = ?");
    $stmt->execute([$title, $content, $post_id, $user['id']]);
    echo json_encode(["status" => "success", "message" => "Post updated successfully!"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Failed to update post: " . $e->getMessage()]);
}
?>