<?php
require '../../config/database.php';
require '../../middleware/auth.php';

header("Content-Type: application/json");

$user = authenticate(); // Ensure user is authenticated

$post_id = $_GET['post_id'] ?? null;

if (!$post_id) {
    echo json_encode(["status" => "error", "message" => "Post ID is required."]);
    exit;
}

try {
    // Fetch post details
    $stmt = $pdo->prepare("SELECT id, title, content, category, tags FROM posts WHERE id = ?");
    $stmt->execute([$post_id]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        echo json_encode(["status" => "error", "message" => "Post not found."]);
        exit;
    }

    // Fetch comments for the post
    $commentStmt = $pdo->prepare("SELECT comments.id, comments.comment, comments.created_at, users.name 
                                  FROM comments 
                                  JOIN users ON comments.user_id = users.id 
                                  WHERE comments.post_id = ? 
                                  ORDER BY comments.created_at ASC");
    $commentStmt->execute([$post_id]);
    $comments = $commentStmt->fetchAll(PDO::FETCH_ASSOC);

    // Attach comments to the post
    $post['comments'] = $comments;

    echo json_encode(["status" => "success", "post" => $post]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch post"]);
}
?>
