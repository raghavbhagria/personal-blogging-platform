document.addEventListener("DOMContentLoaded", function () {
    const createPostForm = document.getElementById("createPostForm");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to create a post.");
        window.location.href = "login.html";
        return;
    }

    createPostForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("postTitle").value.trim();
        const content = document.getElementById("postContent").value.trim();
        const category = document.getElementById("postCategory").value.trim();
        const tags = document.getElementById("postTags").value.trim();
        const image = document.getElementById("postImage").files[0];

        if (!title || !content || !category || !tags) {
            alert("Title, content, category, and tags are required.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category", category);
        formData.append("tags", tags);
        if (image) {
            formData.append("image", image);
        }

        fetch("/raghav49/app/api/posts/create_post.php", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Post created successfully!");
                window.location.href = "posts.html";
            } else {
                alert("Failed to create post: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error creating post:", error);
            alert("An error occurred while creating the post.");
        });
    });
});