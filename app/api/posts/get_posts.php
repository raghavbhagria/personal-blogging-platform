<?php
require '../../config/database.php';

header("Content-Type: application/json");

try {
    $stmt = $pdo->prepare("SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC");
    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "posts" => $posts]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch posts"]);
}
?>
