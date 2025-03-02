<?php
require __DIR__ . '/../config/jwt.php';

function authenticate() {
    $headers = getallheaders();
    
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized"]);
        exit;
    }

    $token = str_replace("Bearer ", "", $headers['Authorization']);
    $decoded = JWTHandler::validateToken($token);

    if (!$decoded) {
        http_response_code(401);
        echo json_encode(["message" => "Invalid token"]);
        exit;
    }

    // Fetch user from database to get isAdmin field
    require __DIR__ . '/../config/database.php';
    $stmt = $pdo->prepare("SELECT id, name, email, isAdmin FROM users WHERE id = ?");
    $stmt->execute([$decoded['id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode(["message" => "User not found"]);
        exit;
    }

    return $user; // Return user data if token is valid
}
?>