<?php
use PHPUnit\Framework\TestCase;

class CommentCreationTest extends TestCase
{
    protected $pdo;

    protected function setUp(): void
    {
        require __DIR__ . '/../app/config/database.php';
        $this->pdo = $pdo;
    }

    public function testCommentIsInsertedProperly()
    {
        // Setup
        $this->pdo->prepare("DELETE FROM users WHERE email = ?")->execute(["commenter@example.com"]);

        $this->pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
            ->execute(["Commenter", "commenter@example.com", password_hash("pass", PASSWORD_DEFAULT)]);
        $userId = $this->pdo->lastInsertId();

        $this->pdo->prepare("INSERT INTO posts (user_id, title, content, category, tags)
            VALUES (?, ?, ?, ?, ?)")
            ->execute([$userId, "Comment Test Post", "Test content", "Misc", "comment"]);
        $postId = $this->pdo->lastInsertId();

        // Add comment
        $this->pdo->prepare("INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)")
            ->execute([$postId, $userId, "This is a test comment"]);
        $commentId = $this->pdo->lastInsertId();

        // Confirm it's stored
        $comment = $this->pdo->query("SELECT * FROM comments WHERE id = $commentId")->fetch(PDO::FETCH_ASSOC);
        $this->assertEquals($postId, $comment['post_id']);
        $this->assertEquals($userId, $comment['user_id']);
        $this->assertEquals("This is a test comment", $comment['comment']);

        // Cleanup
        $this->pdo->prepare("DELETE FROM comments WHERE id = ?")->execute([$commentId]);
        $this->pdo->prepare("DELETE FROM posts WHERE id = ?")->execute([$postId]);
        $this->pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);
    }
}
