<?php
require __DIR__ . '/../config/jwt.php';

function authenticate() {
    $headers = array_change_key_case(getallheaders(), CASE_LOWER); // ✅ Ensure headers are case insensitive
    
    if (!isset($headers['authorization'])) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized - No Authorization header found"]);
        exit;
    }

    $token = str_replace("Bearer ", "", $headers['authorization']);
    error_log("Extracted token: " . $token); // ✅ Debugging: Log token

    $decoded = JWTHandler::validateToken($token);

    if (!$decoded) {
        http_response_code(401);
        echo json_encode(["message" => "Invalid token"]);
        exit;
    }

    // Fetch user from database
    require __DIR__ . '/../config/database.php';
    $stmt = $pdo->prepare("SELECT id, name, email, isAdmin FROM users WHERE id = ?");
    $stmt->execute([$decoded['id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode(["message" => "User not found"]);
        exit;
    }

    return $user; // ✅ Ensure user data is returned
}
?>
