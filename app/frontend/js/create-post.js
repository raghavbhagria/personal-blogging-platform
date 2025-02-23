document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Handle create post form submission
    document.getElementById("createPostForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("postTitle").value;
        const content = document.getElementById("postContent").value;
        const image = document.getElementById("postImage").files[0];

        if (!title || !content) {
            alert("Please fill in all fields.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (image) {
            formData.append("image", image);
        }

        fetch("../api/posts/create.php", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Post created successfully");
                window.location.href = "user-dashboard.html";
            } else {
                alert("Failed to create post: " + data.message);
            }
        })
        .catch(error => console.error("Error creating post:", error));
    });

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("token");
        alert("Logged out successfully.");
        window.location.href = "login.html";
    });
});