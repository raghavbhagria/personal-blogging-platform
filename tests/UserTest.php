<?php
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    protected $pdo;

    protected function setUp(): void
    {
        require __DIR__ . '/../app/config/database.php'; // this will set $pdo
        $this->pdo = $pdo;
    }

    public function testUserCanBeCreated()
    {
        $stmt = $this->pdo->prepare("INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)");
        $result = $stmt->execute([
            "Test User",
            "testuser@example.com",
            password_hash("testpass123", PASSWORD_DEFAULT),
            0
        ]);

        $this->assertTrue($result);

        // Clean up
        $this->pdo->prepare("DELETE FROM users WHERE email = ?")->execute(["testuser@example.com"]);
    }
}
