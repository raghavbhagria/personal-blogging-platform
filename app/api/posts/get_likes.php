<?php
require '../../config/database.php';

header("Content-Type: application/json");

$post_id = $_GET['post_id'] ?? null;

if (!$post_id) {
    echo json_encode(["status" => "error", "message" => "Post ID is required."]);
    exit;
}

try {
    // Fetch likes count dynamically from the likes table
    $stmt = $pdo->prepare("SELECT COUNT(*) AS likes FROM likes WHERE post_id = ?");
    $stmt->execute([$post_id]);
    $likes = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "likes" => $likes['likes']]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch likes"]);
}
?>
