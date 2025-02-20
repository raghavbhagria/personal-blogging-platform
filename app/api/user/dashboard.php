<?php
require __DIR__ . '/../../middleware/auth.php'; // Adjusted path

$user = authenticate(); // If the token is valid, this will return user data.

echo json_encode([
    "status" => "success",
    "message" => "Welcome to your dashboard!",
    "user" => $user
]);
?>
