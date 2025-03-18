<?php
require_once '../../config/database.php';
require_once '../../middleware/auth.php';

header("Content-Type: application/json");

// Authenticate user
$user = authenticate();
$user_id = $user['id'];

$post_id = $_POST['post_id'] ?? null;

if (!$post_id) {
    echo json_encode(["error" => "Post ID is required"]);
    exit;
}

try {
    // Check if the user already liked this post
    $stmt = $pdo->prepare("SELECT * FROM likes WHERE user_id = ? AND post_id = ?");
    $stmt->execute([$user_id, $post_id]);

    if ($stmt->rowCount() > 0) {
        // Unlike the post
        $stmt = $pdo->prepare("DELETE FROM likes WHERE user_id = ? AND post_id = ?");
        $stmt->execute([$user_id, $post_id]);

        // Decrement likes count
        $stmt = $pdo->prepare("UPDATE posts SET likes = likes - 1 WHERE id = ?");
        $stmt->execute([$post_id]);

        // Get updated likes count
        $stmt = $pdo->prepare("SELECT likes FROM posts WHERE id = ?");
        $stmt->execute([$post_id]);
        $likes = $stmt->fetchColumn();

        echo json_encode(["success" => "Post unliked", "likes" => $likes]);
    } else {
        // Like the post
        $stmt = $pdo->prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)");
        $stmt->execute([$user_id, $post_id]);

        // Increment likes count
        $stmt = $pdo->prepare("UPDATE posts SET likes = likes + 1 WHERE id = ?");
        $stmt->execute([$post_id]);

        // Get updated likes count
        $stmt = $pdo->prepare("SELECT likes FROM posts WHERE id = ?");
        $stmt->execute([$post_id]);
        $likes = $stmt->fetchColumn();

        echo json_encode(["success" => "Post liked", "likes" => $likes]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => "Failed to like post", "details" => $e->getMessage()]);
}
?>
