<?php
require '../../config/database.php';
require '../../config/jwt.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Fetch user from database
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Generate JWT Token
        $token = JWTHandler::generateToken($user['id'], $user['email']);

        echo json_encode([
            "status" => "success",
            "message" => "Login successful!",
            "token" => $token
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid email or password!"
        ]);
    }
}
?>
