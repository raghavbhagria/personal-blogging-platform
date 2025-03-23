<?php
require '../../config/database.php';
require '../../middleware/auth.php';

header("Content-Type: application/json");

$user = authenticate();


// Validate input
$post_id = $_POST['post_id'] ?? null;
$title = $_POST['title'] ?? null;
$content = $_POST['content'] ?? null;
$category = $_POST['category'] ?? null;
$tags = $_POST['tags'] ?? null;

if (!$post_id || !$title || !$content || !$category || !$tags) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE posts SET title = ?, content = ?, category = ?, tags = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$title, $content, $category, $tags, $post_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Post updated successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "No changes were made or post not found."]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to update post."]);
}
?>