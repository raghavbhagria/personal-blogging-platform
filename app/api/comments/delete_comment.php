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

$comment_id = $_POST['comment_id'] ?? null;

if (!$comment_id) {
    echo json_encode(["status" => "error", "message" => "Comment ID is required."]);
    exit;
}

try {
    // Admins can delete any comment
    if ($user['isAdmin']) {
        $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
        $stmt->execute([$comment_id]);
    } else {
        // Regular users can only delete their own comments
        $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ? AND user_id = ?");
        $stmt->execute([$comment_id, $user['id']]);
    }

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Comment deleted successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete comment. Comment not found or you don't have permission."]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Failed to delete comment: " . $e->getMessage()]);
}
?>