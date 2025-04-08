<?php
use PHPUnit\Framework\TestCase;

class PostLikesTest extends TestCase
{
    protected $pdo;

    protected function setUp(): void
    {
        require __DIR__ . '/../app/config/database.php';
        $this->pdo = $pdo;
    }

    public function testUserCanLikePostOnce()
    {
        // Setup test user + post
        $this->pdo->prepare("DELETE FROM users WHERE email = ?")->execute(["like_test@example.com"]);

        $this->pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
            ->execute(["Like Tester", "like_test@example.com", password_hash("123456", PASSWORD_DEFAULT)]);
        $userId = $this->pdo->lastInsertId();

        $this->pdo->prepare("INSERT INTO posts (user_id, title, content, category, tags)
            VALUES (?, ?, ?, ?, ?)")
            ->execute([$userId, "Like Test Post", "Some content", "Tech", "like,test"]);
        $postId = $this->pdo->lastInsertId();

        // Like the post
        $this->pdo->prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)")->execute([$userId, $postId]);

        // Try liking again (should fail due to UNIQUE constraint)
        $thrown = false;
        try {
            $this->pdo->prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)")->execute([$userId, $postId]);
        } catch (PDOException $e) {
            $thrown = true;
        }

        $this->assertTrue($thrown, "Second like should be blocked");

        // Count likes
        $likeCount = $this->pdo->query("SELECT COUNT(*) FROM likes WHERE post_id = $postId")->fetchColumn();
        $this->assertEquals(1, $likeCount);

        // Cleanup
        $this->pdo->prepare("DELETE FROM likes WHERE post_id = ?")->execute([$postId]);
        $this->pdo->prepare("DELETE FROM posts WHERE id = ?")->execute([$postId]);
        $this->pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);
    }
}
