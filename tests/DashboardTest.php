<?php
use PHPUnit\Framework\TestCase;

class DashboardTest extends TestCase
{
    protected $url = "http://localhost/personal-blogging-platform/app/api/admin/get_dashboard_data.php";

    public function testDashboardReturnsValidStructure()
    {
        $token = $this->getTestToken();

        $options = [
            "http" => [
                "header" => "Authorization: Bearer $token\r\n"
            ]
        ];

        $context = stream_context_create($options);
        $response = file_get_contents($this->url, false, $context);
        $data = json_decode($response, true);

        $this->assertEquals("success", $data["status"]);
        $this->assertArrayHasKey("postsPerMonth", $data);
        $this->assertArrayHasKey("postsByCategory", $data);
        $this->assertArrayHasKey("userSignups", $data);
        $this->assertArrayHasKey("mostActiveUsers", $data);
        $this->assertArrayHasKey("topPostsByComments", $data);

        $this->assertIsArray($data["postsPerMonth"]["labels"]);
        $this->assertIsArray($data["postsPerMonth"]["counts"]);
    }

    private function getTestToken()
    {
        // This token must match a real admin user in your DB.
        // Ideally you generate it dynamically. For now, use one copied from localStorage
        return "YOUR_VALID_JWT_TOKEN_HERE";
    }
}
