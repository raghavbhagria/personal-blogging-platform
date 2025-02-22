<?php

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define routes
$request = $_SERVER['REQUEST_URI'];

switch ($request) {
    case '/':
    case '/home':
        require 'views/home.php';
        break;

    case '/login':
        require 'views/login.php';
        break;

    case '/register':
        require 'views/register.php';
        break;

    case '/dashboard':
        require 'views/dashboard.php';
        break;

    case '/admin':
        require 'views/admin.php';
        break;

    default:
        http_response_code(404);
        require 'views/404.php';
        break;
}

?>