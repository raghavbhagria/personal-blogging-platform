document.addEventListener("DOMContentLoaded", function () {
    const heroHeading = document.getElementById("hero-heading");
    const heroSubheading = document.getElementById("hero-subheading");
    const heroCTA = document.getElementById("hero-cta");
    const userPostsSection = document.getElementById("user-posts-section");
    const userPostsContainer = document.getElementById("userPostsContainer");
    const token = localStorage.getItem("token");

    if (token) {
        // User is logged in
        heroHeading.textContent = "What is on your mind Today?";
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
});