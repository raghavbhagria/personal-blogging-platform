<?php
require '../../config/database.php';
require '../../middleware/auth.php';

header("Content-Type: application/json");

$user = authenticate();

if (!$user['isAdmin']) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Access denied"]);
    exit;
}

try {
    $stmt = $pdo->query("SELECT comments.id, comments.comment, comments.created_at, posts.title AS post_title, users.name AS author, comments.post_id
                         FROM comments
                         JOIN posts ON comments.post_id = posts.id
                         JOIN users ON comments.user_id = users.id
                         ORDER BY comments.created_at DESC");
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "comments" => $comments]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch comments"]);
}
?>