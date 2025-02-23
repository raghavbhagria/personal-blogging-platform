<?php
require __DIR__ . '/../config/database.php';


header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // ✅ Fetch all posts from database
    try {
        $stmt = $pdo->query("SELECT posts.id, users.name AS username, posts.title, posts.content, posts.created_at 
                             FROM posts 
                             JOIN users ON posts.user_id = users.id
                             ORDER BY posts.created_at DESC");
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "posts" => $posts]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error fetching posts: " . $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ✅ Handle new post creation
    $user_id = $_POST['user_id'] ?? null;
    $title = $_POST['title'] ?? null;
    $content = $_POST['content'] ?? null;

    if (!$user_id || !$title || !$content) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)");
        if ($stmt->execute([$user_id, $title, $content])) {
            echo json_encode(["status" => "success", "message" => "Post created successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error creating post."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
    exit;
}

echo json_encode(["status" => "error", "message" => "Invalid request method."]);
?>
