document.addEventListener("DOMContentLoaded", function () {
    const recentPostsContainer = document.getElementById("userPostsContainer");

    if (!recentPostsContainer) {
        console.error("Error: The element with id 'userPostsContainer' was not found in the DOM.");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        recentPostsContainer.innerHTML = "<p>You must be logged in to view your recent posts.</p>";
        return;
    }

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
            recentPostsContainer.innerHTML = "<p>Failed to load recent posts.</p>";
        }
    })
    .catch(error => {
        console.error("Error fetching recent posts:", error);
        recentPostsContainer.innerHTML = "<p>An error occurred while fetching recent posts.</p>";
    });

    function displayRecentPosts(posts) {
        recentPostsContainer.innerHTML = "";

        if (posts.length === 0) {
            recentPostsContainer.innerHTML = "<p>No recent posts found.</p>";
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <small>Posted on: ${new Date(post.created_at).toLocaleDateString()}</small>
                <a href="post.html?id=${post.id}" class="read-more">Read More</a>
            `;

            recentPostsContainer.appendChild(postElement);
        });
    }
});