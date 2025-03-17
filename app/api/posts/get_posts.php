<?php
require '../../config/database.php';

header("Content-Type: application/json");

try {
    $stmt = $pdo->prepare("SELECT posts.id, posts.title, posts.content, posts.created_at, users.name AS author FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC");
    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "posts" => $posts]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch posts"]);
}
?>