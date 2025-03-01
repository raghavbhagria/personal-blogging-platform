document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Loading Blog Posts...");
    loadNavbar(); // Load the navbar dynamically
    fetchPosts();
});

// ✅ Function to Load Navbar
function loadNavbar() {
    fetch("navbar.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("navbar-container").innerHTML = html;
            updateNavbar(); // Ensure the navbar updates based on login state
        });
}

// ✅ Function to Fetch Posts from API
function fetchPosts() {
    fetch("../api/posts/get_posts.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                displayPosts(data.posts);
            } else {
                console.error("❌ Failed to fetch posts:", data.message);
                document.getElementById("postsContainer").innerHTML = "<p>Failed to load posts.</p>";
            }
        })
        .catch(error => console.error("❌ Error fetching posts:", error));
}

// ✅ Function to Display Posts in a Facebook-Style Feed
function displayPosts(posts) {
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = ""; // Clear loading message

    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>No blog posts found.</p>";
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-user-icon">👤</div>
                <div class="post-info">
                    <h3>${post.title}</h3>
                    <small>Posted on: ${new Date(post.created_at).toLocaleDateString()}</small>
                </div>
            </div>
            <p class="post-content">${post.content.substring(0, 300)}...</p>
            <div class="post-footer">
                <button class="like-button">👍 Like</button>
                <a href="post.html?id=${post.id}" class="read-more">Read More</a>
            </div>
        `;

        postsContainer.appendChild(postElement);
    });
}
