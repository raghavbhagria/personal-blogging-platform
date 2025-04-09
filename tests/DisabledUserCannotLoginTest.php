<?php
use PHPUnit\Framework\TestCase;

class DisabledUserCannotLoginTest extends TestCase
{
    protected $pdo;

    protected function setUp(): void
    {
        require __DIR__ . '/../app/config/database.php';
        $this->pdo = $pdo;
    }

    public function testDisabledUserIsBlocked()
    {
        $email = "disabled_user@example.com";
        $password = "testpass123";

        // Clean up if user already exists
$this->pdo->prepare("DELETE FROM users WHERE email = ?")->execute([$email]);

// Create disabled user
$this->pdo->prepare("INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, 0)")
    ->execute(["Disabled User", $email, password_hash($password, PASSWORD_DEFAULT)]);

        // Try login
        $loginUrl = "http://localhost/personal-blogging-platform/app/api/auth/login.php";
        $body = json_encode(["email" => $email, "password" => $password]);

        $options = [
            "http" => [
                "header" => "Content-Type: application/json\r\n",
                "method" => "POST",
                "content" => $body
            ]
        ];

        $context = stream_context_create($options);
        $response = file_get_contents($loginUrl, false, $context);
        $data = json_decode($response, true);

        $this->assertEquals("error", $data["status"]);
        $this->assertEquals("Your account has been disabled by the admin.", $data["message"]);


        // Cleanup
        $this->pdo->prepare("DELETE FROM users WHERE email = ?")->execute([$email]);
    }
}
