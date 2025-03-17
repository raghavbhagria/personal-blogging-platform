document.addEventListener("DOMContentLoaded", function () {
    const recentPostsContainer = document.getElementById("recentPostsContainer");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view your recent posts.");
        window.location.href = "login.html";
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
                <p>${post.content}</p>
                <small>Posted on: ${new Date(post.created_at).toLocaleDateString()}</small>
                <p><strong>Category:</strong> ${post.category}</p>
                <p><strong>Tags:</strong> ${post.tags}</p>
            `;

            recentPostsContainer.appendChild(postElement);
        });

        const morePostsLink = document.createElement("a");
        morePostsLink.href = "userPosts.html";
        morePostsLink.textContent = "More Blogs";
        recentPostsContainer.appendChild(morePostsLink);
    }
});