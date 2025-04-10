<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home | Personal Blogging Platform</title>
    <link rel="stylesheet" href="app/frontend/assets/css/home.css">
    <script defer src="app/frontend/js/home.js"></script>
</head>
<body>

    <!-- Navigation Bar -->
    <header>
        <div id="navbar-container"></div> <!-- Navbar will be loaded here -->
        <script>
            // Load the shared navbar dynamically
            fetch("/personal-blogging-platform/app/frontend/pages/navbar.html")
                .then(response => response.text())
                .then(html => {
                    document.getElementById("navbar-container").innerHTML = html;
                    updateNavbar(); // Ensure navbar updates based on login state
                });
        </script>
        <script defer src="app/frontend/js/auth.js"></script> <!-- Ensure auth.js is loaded -->
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <h1 id="hero-heading">Express Yourself Through Blogging</h1>
        <p id="hero-subheading">Share your thoughts, ideas, and stories with the world.</p>
        <a id="hero-cta" href="/app/frontend/pages/register.html" class="cta-btn">Start Writing</a>
    </section>

   <!-- Latest Blog Posts Section -->
   <section class="latest-posts">
        <h2>Latest Blog Posts</h2>
        <div class="category-tabs">
            <button class="category-tab active" data-category="all">All</button>
            <button class="category-tab" data-category="technology">Technology</button>
            <button class="category-tab" data-category="lifestyle">Lifestyle</button>
            <button class="category-tab" data-category="travel">Travel</button>
            <button class="category-tab" data-category="health">Health</button>
            <button class="category-tab" data-category="business">Business</button>
        </div>
        <div id="latestPostsContainer" class="posts-container">
            <!-- Latest blog posts will be dynamically loaded here -->
        </div>
        <div class="explore-more-container">
            <a href="app/frontend/pages/posts.html" class="cta-btn explore-more-btn">Explore More Blogs</a>
        </div>
</section>

    <!-- User's Recent Posts Section -->
    <section id="user-posts-section" class="user-posts" style="display: none;">
        <h2>Your Recent Posts</h2>
        <div id="userPostsContainer" class="posts-container">
            <!-- User's posts will be dynamically loaded here -->
        </div>
        <div class="explore-more-container">
            <a href="app/frontend/pages/userPosts.html" class="cta-btn">More Blogs</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>© 2025 MyBlog. All rights reserved.</p>
    </footer>

</body>
</html>