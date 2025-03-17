document.addEventListener("DOMContentLoaded", function () {
    const userPostsContainer = document.getElementById("userPostsContainer");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view your posts.");
        window.location.href = "login.html";
        return;
    }

    fetch("../api/posts/get_user_posts.php", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            displayUserPosts(data.posts);
        } else {
            userPostsContainer.innerHTML = "<p>Failed to load posts.</p>";
        }
    })
    .catch(error => {
        console.error("Error fetching user posts:", error);
        userPostsContainer.innerHTML = "<p>An error occurred while fetching posts.</p>";
    });

    function displayUserPosts(posts) {
        userPostsContainer.innerHTML = "";

        if (posts.length === 0) {
            userPostsContainer.innerHTML = "<p>No posts found.</p>";
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
                <button onclick="editPost(${post.id})">Edit</button>
                <button onclick="deletePost(${post.id})">Delete</button>
            `;

            userPostsContainer.appendChild(postElement);
        });
    }
});

function editPost(postId) {
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");
    const newCategory = prompt("Enter new category:");
    const newTags = prompt("Enter new tags (comma separated):");

    if (!newTitle || !newContent || !newCategory || !newTags) {
        alert("Title, content, category, and tags are required.");
        return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("post_id", postId);
    formData.append("title", newTitle);
    formData.append("content", newContent);
    formData.append("category", newCategory);
    formData.append("tags", newTags);

    fetch("../api/posts/update_post.php", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Post updated successfully!");
            window.location.reload();
        } else {
            alert("Failed to update post: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error updating post:", error);
        alert("An error occurred while updating the post.");
    });
}

function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) {
        return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("post_id", postId);

    fetch("../api/posts/delete_post.php", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Post deleted successfully!");
            window.location.reload();
        } else {
            alert("Failed to delete post: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error deleting post:", error);
        alert("An error occurred while deleting the post.");
    });
}