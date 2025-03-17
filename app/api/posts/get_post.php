<?php
require '../../config/database.php';
require '../../middleware/auth.php';

header("Content-Type: application/json");

$user = authenticate();

$post_id = $_GET['post_id'] ?? null;

if (!$post_id) {
    echo json_encode(["status" => "error", "message" => "Post ID is required."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, title, content, category, tags FROM posts WHERE id = ? AND user_id = ?");
    $stmt->execute([$post_id, $user['id']]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($post) {
        echo json_encode(["status" => "success", "post" => $post]);
    } else {
        echo json_encode(["status" => "error", "message" => "Post not found."]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch post"]);
}
?>