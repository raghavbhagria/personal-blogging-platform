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

if (!$post_id) {
    echo json_encode(["status" => "error", "message" => "Post ID is required."]);
    exit;
}

try {
    // Check if the user is an admin
    if ($user['isAdmin']) {
        // Admin can delete any post
        $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
        $stmt->execute([$post_id]);
    } else {
        // Regular users can only delete their own posts
        $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ? AND user_id = ?");
        $stmt->execute([$post_id, $user['id']]);
    }

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Post deleted successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete post. Post not found or you don't have permission."]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Failed to delete post: " . $e->getMessage()]);
}
?>