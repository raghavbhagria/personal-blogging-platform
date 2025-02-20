<?php
require __DIR__ . '/../../vendor/autoload.php'; // Correct path adjustment

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTHandler {
    private static $secretKey = "your_secret_key";
    private static $issuer = "yourdomain.com";

    public static function generateToken($user_id, $email) {
        $payload = [
            "iss" => self::$issuer,
            "iat" => time(),
            "exp" => time() + (60 * 60),
            "data" => [
                "id" => $user_id,
                "email" => $email
            ]
        ];
        return JWT::encode($payload, self::$secretKey, 'HS256');
    }

    public static function validateToken($token) {
        try {
            $decoded = JWT::decode($token, new Key(self::$secretKey, 'HS256'));
            return (array) $decoded->data;
        } catch (Exception $e) {
            return false;
        }
    }
}
?>
