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
    $stmt = $pdo->query("SELECT posts.id, posts.title, posts.created_at, users.name AS author 
                         FROM posts 
                         JOIN users ON posts.user_id = users.id 
                         ORDER BY posts.created_at DESC");
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "posts" => $posts]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch posts"]);
}

?>

