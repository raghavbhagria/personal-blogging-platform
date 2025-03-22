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

try {
    $stmt = $pdo->prepare("SELECT email FROM users WHERE id = ?");
    $stmt->execute([$user['id']]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin) {
        echo json_encode(["status" => "success", "admin" => $admin]);
    } else {
        echo json_encode(["status" => "error", "message" => "Admin not found"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch admin details", "details" => $e->getMessage()]);
}

?>

