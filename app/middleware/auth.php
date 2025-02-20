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

    return $decoded; // Return user data if token is valid
}
?>
