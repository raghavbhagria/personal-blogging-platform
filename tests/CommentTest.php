<?php
use PHPUnit\Framework\TestCase;

class CommentTest extends TestCase
{
    protected $pdo;

    protected function setUp(): void
    {
        require __DIR__ . '/../app/config/database.php';
        $this->pdo = $pdo;
    }

    public function testCommentCanBeAdded()
    {
        // Step 1: Insert test user
        $this->pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
            ->execute(["Comment Tester", "commenter@example.com", password_hash("pass", PASSWORD_DEFAULT)]);
        $userId = $this->pdo->lastInsertId();

        // Step 2: Insert test post
        $this->pdo->prepare("INSERT INTO posts (user_id, title, content, category, tags)
            VALUES (?, ?, ?, ?, ?)")
            ->execute([$userId, "Test Post for Commenting", "Post content here", "Lifestyle", "comment,test"]);
        $postId = $this->pdo->lastInsertId();

        // Step 3: Add a comment
        $stmt = $this->pdo->prepare("INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)");
        $result = $stmt->execute([$postId, $userId, "This is a test comment!"]);

        $this->assertTrue($result);

        // ✅ Clean up
        $this->pdo->prepare("DELETE FROM comments WHERE post_id = ?")->execute([$postId]);
        $this->pdo->prepare("DELETE FROM posts WHERE id = ?")->execute([$postId]);
        $this->pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);
    }
}
