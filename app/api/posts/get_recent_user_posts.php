<?php
require '../../config/database.php';
require '../../middleware/auth.php';

header("Content-Type: application/json");

$user = authenticate();

try {
    $stmt = $pdo->prepare("SELECT id, title, content, created_at, category, tags FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 3");
    $stmt->execute([$user['id']]);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "posts" => $posts]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch posts"]);
}
?>