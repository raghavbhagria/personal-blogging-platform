<?php
use PHPUnit\Framework\TestCase;

class DashboardUnauthorizedTest extends TestCase
{
    public function testDashboardReturnsUnauthorized()
    {
        $url = "http://localhost/personal-blogging-platform/app/api/admin/get_dashboard_data.php";

        $options = [
            "http" => [
                "method" => "GET",
                "header" => "" // no Authorization header
            ]
        ];

        $context = stream_context_create($options);
        $response = file_get_contents($url, false, $context);

        $data = json_decode($response, true);

        $this->assertEquals("error", $data["status"]);
        $this->assertEquals("Unauthorized", $data["message"]);
    }
}
