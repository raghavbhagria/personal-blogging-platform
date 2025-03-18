document.addEventListener("DOMContentLoaded", function () {
    const editPostForm = document.getElementById("editPostForm");
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("post_id");

    if (!token) {
        alert("You must be logged in to edit a post.");
        window.location.href = "login.html";
        return;
    }

    if (!postId) {
        alert("Post ID is required.");
        window.location.href = "userPosts.html";
        return;
    }

    fetch(`../api/posts/get_post.php?post_id=${postId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const post = data.post;
            document.getElementById("postTitle").value = post.title;
            document.getElementById("postContent").value = post.content;
            document.getElementById("postCategory").value = post.category;
            document.getElementById("postTags").value = post.tags;
        } else {
            alert("Failed to load post: " + data.message);
            window.location.href = "userPosts.html";
        }
    })
    .catch(error => {
        console.error("Error fetching post:", error);
        alert("An error occurred while fetching the post.");
        window.location.href = "userPosts.html";
    });

    editPostForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("postTitle").value.trim();
        const content = document.getElementById("postContent").value.trim();
        const category = document.getElementById("postCategory").value.trim();
        const tags = document.getElementById("postTags").value.trim();

        if (!title || !content || !category || !tags) {
            alert("Title, content, category, and tags are required.");
            return;
        }

        const formData = new FormData();
        formData.append("post_id", postId);
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category", category);
        formData.append("tags", tags);

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
                window.location.href = "userPosts.html";
            } else {
                alert("Failed to update post: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error updating post:", error);
            alert("An error occurred while updating the post.");
        });
    });
});