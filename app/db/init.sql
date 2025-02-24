-- Ensure we are using the correct database
CREATE DATABASE IF NOT EXISTS blogging_platform;
USE blogging_platform;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isAdmin BOOLEAN DEFAULT FALSE
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password) VALUES 
('Admin', 'admin@example.com', SHA2('adminpassword', 256));

INSERT INTO users (name, email, password, created_at) VALUES
('Admin', 'user1@blog.com', 'hashed_password', NOW()),
('John Doe', 'user2@blog.com', 'hashed_password', NOW()),
('Tech Guru', 'user3@blog.com', 'hashed_password', NOW()),
('DevLife', 'user4@blog.com', 'hashed_password', NOW()),
('Coder123', 'user5@blog.com', 'hashed_password', NOW()),
('AI Enthusiast', 'user6@blog.com', 'hashed_password', NOW()),
('Web Master', 'user7@blog.com', 'hashed_password', NOW()),
('Frontend Ninja', 'user8@blog.com', 'hashed_password', NOW()),
('Backend Beast', 'user9@blog.com', 'hashed_password', NOW()),
('Security Expert', 'user10@blog.com', 'hashed_password', NOW());


INSERT INTO posts (user_id, title, content, created_at) VALUES
(6, 'How to Optimize Your Code for Performance', 'REST and GraphQL are popular API architectures. Which one should you choose?', '2025-02-06 07:33:04'),
(7, 'How to Optimize Your Code for Performance', 'A responsive website is crucial in 2025. Let\'s break down key principles of mobile-friendly design.', '2025-02-04 21:28:04'),
(5, 'How to Optimize Your Code for Performance', 'Artificial Intelligence is changing how we develop web applications. Let\'s explore the trends!', '2025-02-07 20:50:04'),
(8, 'Why Blogging is Essential for Developers', 'REST and GraphQL are popular API architectures. Which one should you choose?', '2025-01-29 06:50:04'),
(10, 'The Power of Open Source Contributions', 'Developers should blog to share knowledge and grow their personal brand. Here\'s why!', '2025-01-29 22:51:04'),
(3, 'Why Blogging is Essential for Developers', 'Scalability is key for backend systems. Learn how to make your backend robust and efficient.', '2025-02-22 13:32:04'),
(4, 'Understanding APIs: REST vs GraphQL', 'CSS frameworks save time. Here are the top frameworks you should consider using this year.', '2025-02-08 10:28:04'),
(6, 'How to Build a Scalable Backend with Node.js', 'Writing optimized code is an essential skill. Here’s how to speed up your web apps.', '2025-02-17 12:50:04'),
(4, 'Why Blogging is Essential for Developers', 'Here are some neat JavaScript tricks that can boost your productivity as a developer.', '2025-02-16 02:11:04'),
(4, '10 JavaScript Tricks You Need to Know', 'Contributing to open source projects is a great way to learn and network. Get started today!', '2025-02-06 08:11:04');

