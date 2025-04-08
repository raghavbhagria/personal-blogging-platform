<?php
use PHPUnit\Framework\TestCase;

class PostTest extends TestCase
{
    protected $pdo;

    protected function setUp(): void
    {
        require __DIR__ . '/../app/config/database.php';
        $this->pdo = $pdo;
    }

    public function testPostCanBeCreated()
    {
        // Insert a user to own the post
        $this->pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
            ->execute(["Test Author", "post_author@example.com", password_hash("pass", PASSWORD_DEFAULT)]);

        $userId = $this->pdo->lastInsertId();

        // Create a post
        $stmt = $this->pdo->prepare("
            INSERT INTO posts (user_id, title, content, category, tags)
            VALUES (?, ?, ?, ?, ?)
        ");
        $result = $stmt->execute([
            $userId,
            "Test Blog Title",
            "This is a test post content.",
            "Technology",
            "test,phpunit"
        ]);

        $this->assertTrue($result);

        // Clean up post + user
        $this->pdo->prepare("DELETE FROM posts WHERE user_id = ?")->execute([$userId]);
        $this->pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);
    }
}
