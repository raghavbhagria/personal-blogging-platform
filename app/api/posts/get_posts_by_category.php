<?php
require '../../config/database.php';

header("Content-Type: application/json");

$category = $_GET['category'] ?? 'all';
$page = $_GET['page'] ?? 1;
$limit = 12; // Number of posts per page
$offset = ($page - 1) * $limit;

try {
    if ($category === 'all') {
        // Fetch all posts for the "All" category
        $stmt = $pdo->prepare("SELECT SQL_CALC_FOUND_ROWS id, title, content, created_at, category FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->bindValue(2, $offset, PDO::PARAM_INT);
        $stmt->execute();
    } else {
        // Fetch posts for a specific category
        $stmt = $pdo->prepare("SELECT SQL_CALC_FOUND_ROWS id, title, content, created_at, category FROM posts WHERE category = ? ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $stmt->bindValue(1, $category, PDO::PARAM_STR);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->bindValue(3, $offset, PDO::PARAM_INT);
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
        "message" => "Failed to fetch posts: " . $e->getMessage()
    ]);
}
?>