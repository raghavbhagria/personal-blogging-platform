<?php
require '../../config/database.php';
require '../../middleware/auth.php';

header("Content-Type: application/json");

// Authenticate the user
$user = authenticate();

if (!$user) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$category = $_GET['category'] ?? 'all';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 12;
$offset = ($page - 1) * $limit;



try {
    if ($category === 'all') {
        // Fetch all posts for the logged-in user
        $stmt = $pdo->prepare("
            SELECT SQL_CALC_FOUND_ROWS id, title, content, created_at, category, 
                (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likes 
            FROM posts 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        ");
        $stmt->bindValue(1, $user['id'], PDO::PARAM_INT);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->bindValue(3, $offset, PDO::PARAM_INT);
        $stmt->execute();
    } else {
        // Fetch posts for the logged-in user filtered by category
        $stmt = $pdo->prepare("
            SELECT SQL_CALC_FOUND_ROWS id, title, content, created_at, category, 
                (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likes 
            FROM posts 
            WHERE user_id = ? AND category = ? 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        ");
        $stmt->bindValue(1, $user['id'], PDO::PARAM_INT);
        $stmt->bindValue(2, $category, PDO::PARAM_STR);
        $stmt->bindValue(3, $limit, PDO::PARAM_INT);
        $stmt->bindValue(4, $offset, PDO::PARAM_INT);
        $stmt->execute();
    }

    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get the total number of posts for pagination
    $totalStmt = $pdo->query("SELECT FOUND_ROWS()");
    $totalPosts = $totalStmt->fetchColumn();
    $totalPages = ceil($totalPosts / $limit);

    echo json_encode([
        "status" => "success",
        "posts" => $posts,
        "totalPages" => $totalPages
    ]);
} catch (Exception $e) {
    

    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch posts",
        "details" => $e->getMessage()
    ]);
}
?>