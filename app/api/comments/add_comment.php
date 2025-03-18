<?php
require_once '../../config/database.php';
require_once '../../middleware/auth.php';

header("Content-Type: application/json");

// Authenticate user
$user = authenticate(); // ✅ Ensures authentication
$user_id = $user['id']; // ✅ Fetch user ID

$post_id = $_POST['post_id'] ?? null;
$comment = trim($_POST['comment'] ?? '');

if (!$post_id || empty($comment)) {
    echo json_encode(["error" => "Post ID and comment are required"]);
    exit;
}

// Insert comment into database
$stmt = $pdo->prepare("INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)");
$stmt->execute([$post_id, $user_id, $comment]);

if ($stmt->rowCount()) {
    echo json_encode(["success" => "Comment added successfully"]);
} else {
    echo json_encode(["error" => "Failed to add comment"]);
}
?>
