document.addEventListener("DOMContentLoaded", function () {
    const heroHeading = document.getElementById("hero-heading");
    const heroSubheading = document.getElementById("hero-subheading");
    const heroCTA = document.getElementById("hero-cta");
    const userPostsSection = document.getElementById("user-posts-section");
    const userPostsContainer = document.getElementById("userPostsContainer");
    const categoryTabs = document.querySelectorAll(".category-tab");
    const latestPostsContainer = document.getElementById("latestPostsContainer");
    const token = localStorage.getItem("token");

    // Update hero section and show/hide "Your Recent Posts" section based on login state
    if (token) {
        // User is logged in
        heroHeading.textContent = "What's on your mind today?";
        heroSubheading.textContent = "Start sharing your thoughts with the world.";
        heroCTA.textContent = "Create Post";
        heroCTA.href = "createPost.html";

        // Show "Your Recent Posts" section
        userPostsSection.style.display = "block";

        // Fetch and display user's recent posts
        fetch("../api/posts/get_recent_user_posts.php", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                displayRecentPosts(data.posts);
            } else {
                userPostsContainer.innerHTML = "<p>Failed to load recent posts.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching recent posts:", error);
            userPostsContainer.innerHTML = "<p>An error occurred while fetching recent posts.</p>";
        });
    } else {
        // User is not logged in
        userPostsSection.style.display = "none";
    }

    // Fetch and display posts based on the selected category
    function fetchPostsByCategory(category) {
        latestPostsContainer.innerHTML = "<p>Loading...</p>";

        fetch(`../api/posts/get_posts_by_category.php?category=${category}&limit=3`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    displayLatestPosts(data.posts);
                } else {
                    latestPostsContainer.innerHTML = "<p>No posts found for this category.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching posts by category:", error);
                latestPostsContainer.innerHTML = "<p>An error occurred while fetching posts.</p>";
            });
    }

    // Display posts in the "Latest Blog Posts" section
    function displayLatestPosts(posts) {
        latestPostsContainer.innerHTML = "";

        if (posts.length === 0) {
            latestPostsContainer.innerHTML = "<p>No posts found.</p>";
            return;
        }

        posts.slice(0, 3).forEach(post => {
            const postElement = document.createElement("a");
            postElement.classList.add("post");
            postElement.href = `post.html?id=${post.id}`;

            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <small>Posted on: ${new Date(post.created_at).toLocaleDateString()}</small>
                <button class="read-more-btn">Read More</button>
            `;

            latestPostsContainer.appendChild(postElement);
        });
    }

    // Display user's recent posts in the "Your Recent Posts" section
    function displayRecentPosts(posts) {
        userPostsContainer.innerHTML = "";

        if (posts.length === 0) {
            userPostsContainer.innerHTML = "<p>No recent posts found.</p>";
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement("a");
            postElement.classList.add("post");
            postElement.href = `post.html?id=${post.id}`;

            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <small>Posted on: ${new Date(post.created_at).toLocaleDateString()}</small>
                <button class="read-more-btn">Read More</button>
            `;

            userPostsContainer.appendChild(postElement);
        });
    }

    // Handle category tab clicks
    categoryTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove("active"));
            // Add active class to the clicked tab
            this.classList.add("active");

            // Fetch posts for the selected category
            const selectedCategory = this.getAttribute("data-category");
            fetchPostsByCategory(selectedCategory);
        });
    });

    // Fetch posts for the default category (All) on page load
    fetchPostsByCategory("all");
});