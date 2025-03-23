-- Ensure we are using the correct database
CREATE DATABASE IF NOT EXISTS blogging_platform;
USE blogging_platform;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    isAdmin TINYINT(1) NOT NULL DEFAULT 0, -- 0 = Regular User, 1 = Admin
    status TINYINT(1) NOT NULL DEFAULT 1, -- 1 = Enabled, 0 = Disabled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create posts table (with likes column)
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_path VARCHAR(255) DEFAULT NULL,
    category VARCHAR(255) NOT NULL,
    tags VARCHAR(255) NOT NULL,
    likes INT DEFAULT 0, -- ✅ Added likes column
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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

-- ✅ Create likes table (Prevents duplicate likes by tracking user ID and post ID)
CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE (user_id, post_id) -- Ensures each user can only like a post once
);

-- Insert sample users




=======
INSERT INTO users (id, name, email, password, isAdmin, status, created_at) VALUES
(1, 'John Doe', 'user2@blog.com', 'hashed_password', 0, 1, NOW()),
(2, 'Tech Guru', 'user3@blog.com', 'hashed_password', 0, 1, NOW()),
(3, 'DevLife', 'user4@blog.com', 'hashed_password', 0, 1, NOW()),
(4, 'Coder123', 'user5@blog.com', 'hashed_password', 0, 1, NOW()),
(5, 'AI Enthusiast', 'user6@blog.com', 'hashed_password', 0, 1, NOW()),
(6, 'Web Master', 'user7@blog.com', 'hashed_password', 1, 1, NOW()), -- Admin
(7, 'Frontend Ninja', 'user8@blog.com', 'hashed_password', 0, 1, NOW()),
(8, 'Backend Beast', 'user9@blog.com', 'hashed_password', 0, 1, NOW()),
(9, 'Security Expert', 'user10@blog.com', 'hashed_password', 0, 0, NOW()); -- Disabled user
(10, 'Admin', 'admin@example.com', '$2y$12$NO6VmmUfqs9yr2THPLw9KeHWL0fGvQP7Gn97Q/mpSZPAX9g4VZQRu', 1, NOW());


-- Insert sample posts (with default likes = 0)
INSERT INTO posts (id, user_id, title, content, category, tags, created_at) VALUES
(1, 6, 'How to Optimize Your Code for Performance', 'REST and GraphQL are popular API architectures. Which one should you choose?', 'Technology', 'REST,GraphQL,API',  '2025-02-06 07:33:04'),
(2, 7, 'How to Optimize Your Code for Performance', 'A responsive website is crucial in 2025. Let\'s break down key principles of mobile-friendly design.', 'Technology', 'Responsive Design,Mobile',  '2025-02-04 21:28:04'),
(3, 5, 'How to Optimize Your Code for Performance', 'Artificial Intelligence is changing how we develop web applications. Let\'s explore the trends!', 'Technology', 'AI,Web Development', '2025-02-07 20:50:04'),
(4, 8, 'Why Blogging is Essential for Developers', 'REST and GraphQL are popular API architectures. Which one should you choose?', 'Lifestyle', 'Blogging,Developers', '2025-01-29 06:50:04'),
(5, 9, 'The Power of Open Source Contributions', 'Developers should blog to share knowledge and grow their personal brand. Here\'s why!', 'Technology', 'Open Source,Contributions',  '2025-01-29 22:51:04');

-- ✅ Insert sample comments
INSERT INTO comments (post_id, user_id, comment, created_at) VALUES
(1, 2, 'Great post! Really helped me understand the difference between REST and GraphQL.', '2025-02-06 10:15:00'),
(1, 3, 'I prefer REST for small projects but GraphQL for larger ones. Thoughts?', '2025-02-06 11:30:00'),
(2, 4, 'Responsive design is a must these days. Do you have recommendations for frameworks?', '2025-02-05 09:45:00'),
(3, 6, 'AI is revolutionizing web dev. I love using TensorFlow.js!', '2025-02-08 13:20:00'),
(3, 7, 'What are your thoughts on AI-generated code? Will it replace developers?', '2025-02-08 15:45:00'),
(4, 5, 'Blogging is essential for personal branding. I started my own last year!', '2025-01-30 08:50:00'),
(4, 9, 'Nice insights! Blogging has really helped me share my knowledge.', '2025-02-01 14:10:00'),
(5, 1, 'Open-source contributions helped me land my first dev job!', '2025-01-30 18:30:00'),
(5, 3, 'I recently contributed to an open-source project. It was an amazing experience.', '2025-02-02 09:25:00'),
(5, 8, 'Which open-source projects do you recommend for beginners?', '2025-02-02 16:40:00');