<?php
require '../../config/database.php'; // Ensure database connection is available
require '../../middleware/auth.php';

header("Content-Type: application/json");

global $pdo; // Use the PDO connection from database.php

$post_id = $_GET['post_id'] ?? null;

if (!$post_id) {
    echo json_encode(["status" => "error", "message" => "Post ID is required."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT c.id, c.comment, c.created_at, u.name AS author
                           FROM comments c 
                           JOIN users u ON c.user_id = u.id 
                           WHERE c.post_id = ? 
                           ORDER BY c.created_at DESC");
    $stmt->execute([$post_id]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "comments" => $comments]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch comments", "details" => $e->getMessage()]);
}
?>