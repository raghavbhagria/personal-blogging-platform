<?php
require '../../config/database.php';
require '../../config/jwt.php';

header("Content-Type: application/json");

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

try {
    $userData = JWTHandler::validateToken($matches[1]);

    // ====== 1. Posts Per Month ======
    $stmt = $pdo->query("
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
        FROM posts
        GROUP BY month
    ");
    $monthly = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $postsPerMonth = [
        "labels" => array_column($monthly, "month"),
        "counts" => array_column($monthly, "count")
    ];

    // ====== 2. Posts by Category ======
    $stmt = $pdo->query("
        SELECT category, COUNT(*) AS count
        FROM posts
        GROUP BY category
    ");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $postsByCategory = [
        "labels" => array_column($categories, "category"),
        "counts" => array_column($categories, "count")
    ];

    // ====== 3. User Signups Over Time ======
    $stmt = $pdo->query("
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
        FROM users
        GROUP BY month
    ");
    $signupData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $userSignups = [
        "labels" => array_column($signupData, "month"),
        "counts" => array_column($signupData, "count")
    ];

    // ====== 4. Most Active Users (Posts + Comments) ======
    $stmt = $pdo->query("
        SELECT u.name AS username, 
               COUNT(DISTINCT p.id) AS posts,
               COUNT(DISTINCT c.id) AS comments
        FROM users u
        LEFT JOIN posts p ON p.user_id = u.id
        LEFT JOIN comments c ON c.user_id = u.id
        GROUP BY u.id
        ORDER BY (posts + comments) DESC
        LIMIT 5
    ");
    $activeUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $mostActiveUsers = [
        "labels" => array_column($activeUsers, "username"),
        "postCounts" => array_column($activeUsers, "posts"),
        "commentCounts" => array_column($activeUsers, "comments")
    ];

    // ====== 5. Top Posts by Comment Count ======
    $stmt = $pdo->query("
        SELECT p.title, COUNT(c.id) AS comment_count
        FROM posts p
        LEFT JOIN comments c ON c.post_id = p.id
        GROUP BY p.id
        ORDER BY comment_count DESC
        LIMIT 5
    ");
    $topPosts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $topPostsByComments = [
        "labels" => array_column($topPosts, "title"),
        "counts" => array_column($topPosts, "comment_count")
    ];

    // ====== Final JSON Output ======
    echo json_encode([
        "status" => "success",
        "postsPerMonth" => $postsPerMonth,
        "postsByCategory" => $postsByCategory,
        "userSignups" => $userSignups,
        "mostActiveUsers" => $mostActiveUsers,
        "topPostsByComments" => $topPostsByComments
    ]);

} catch (Exception $e) {
    // Optional: log to server error logs
    error_log("Dashboard Data Error: " . $e->getMessage());

    // Output the real error for debugging (remove in production)
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage() // show real error
    ]);
}
