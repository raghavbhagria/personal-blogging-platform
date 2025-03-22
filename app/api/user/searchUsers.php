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

$query = $_GET['query'] ?? '';

try {
    $stmt = $pdo->prepare("
        SELECT DISTINCT users.id, users.name, users.email, users.isAdmin, users.status
        FROM users
        LEFT JOIN posts ON users.id = posts.user_id
        WHERE users.name LIKE ? 
            OR users.email LIKE ? 
            OR posts.title LIKE ? 
            OR posts.category LIKE ? -- Added condition for category
    ");
    $searchTerm = "%$query%";
    $stmt->execute([$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "users" => $users]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to search users", "details" => $e->getMessage()]);
}
?>