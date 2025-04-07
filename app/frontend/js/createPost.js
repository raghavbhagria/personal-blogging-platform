document.addEventListener("DOMContentLoaded", function () {
    const createPostForm = document.getElementById("createPostForm");
    const token = localStorage.getItem("token");

    if (!token) {
        showToast("You must be logged in to create a post.", "error");
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
            showToast("Title, content, category, and tags are required.", "error");
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

        fetch("/personal-blogging-platform/app/api/posts/create_post.php", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                showToast("✅ Post created successfully!", "success");
                setTimeout(() => {
                    window.location.href = "posts.html";
                }, 3000);
            } else {
                showToast("❌ Failed to create post: " + data.message, "error");
            }
        })
        .catch(error => {
            console.error("Error creating post:", error);
            showToast("❌ An error occurred while creating the post.", "error");
        });
    });

    // ✅ Toast Function
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("fade-out");
        }, 2500);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});
