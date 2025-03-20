<?php
require '../../config/database.php';
require '../../config/jwt.php';

header("Content-Type: application/json");

$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? trim($headers['Authorization']) : '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized - No Authorization header found"]);
    exit;
}

$token = $matches[1];

try {
    $userData = JWTHandler::validateToken($token);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid session"]);
    exit;
}

$postId = $_GET['id'] ?? null;

if (!$postId) {
    echo json_encode(["status" => "error", "message" => "Post ID is required"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT posts.*, users.name AS author FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?");
    $stmt->execute([$postId]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($post) {
        // Fetch comments
        $stmt = $pdo->prepare("SELECT comments.*, users.name FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = ? ORDER BY comments.created_at ASC");
        $stmt->execute([$postId]);
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $post['comments'] = $comments;

        echo json_encode(["status" => "success", "post" => $post]);
    } else {
        echo json_encode(["status" => "error", "message" => "Post not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch post: " . $e->getMessage()]);
}
?>
