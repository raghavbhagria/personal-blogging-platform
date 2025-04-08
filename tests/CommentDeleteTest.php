<?php
use PHPUnit\Framework\TestCase;

class CommentDeleteTest extends TestCase
{
    protected $pdo;

    protected function setUp(): void
    {
        require __DIR__ . '/../app/config/database.php';
        $this->pdo = $pdo;
    }

    public function testCommentCanBeDeleted()
    {
        // Create test user
        $this->pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
            ->execute(["Delete Tester", "delete_comment@example.com", password_hash("pass", PASSWORD_DEFAULT)]);
        $userId = $this->pdo->lastInsertId();

        // Create test post
        $this->pdo->prepare("INSERT INTO posts (user_id, title, content, category, tags)
            VALUES (?, ?, ?, ?, ?)")
            ->execute([$userId, "Post for Deletion Test", "Content", "Technology", "delete"]);
        $postId = $this->pdo->lastInsertId();

        // Add test comment
        $this->pdo->prepare("INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)")
            ->execute([$postId, $userId, "Comment to be deleted"]);
        $commentId = $this->pdo->lastInsertId();

        // Confirm it exists
        $exists = $this->pdo->query("SELECT COUNT(*) FROM comments WHERE id = $commentId")->fetchColumn();
        $this->assertEquals(1, $exists);

        // Delete it
        $deleted = $this->pdo->prepare("DELETE FROM comments WHERE id = ?")->execute([$commentId]);
        $this->assertTrue($deleted);

        // Confirm deletion
        $stillExists = $this->pdo->query("SELECT COUNT(*) FROM comments WHERE id = $commentId")->fetchColumn();
        $this->assertEquals(0, $stillExists);

        // Cleanup
        $this->pdo->prepare("DELETE FROM posts WHERE id = ?")->execute([$postId]);
        $this->pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);
    }
}
