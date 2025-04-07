document.addEventListener("DOMContentLoaded", function () {
    const editBlogForm = document.getElementById("editBlogForm");
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("post_id");

    if (!token) {
        alert("You must be logged in as an admin to edit a blog post.");
        window.location.href = "login.html";
        return;
    }

    if (!postId) {
        alert("Post ID is required.");
        window.location.href = "admin_blogs.html";
        return;
    }

    // Fetch the blog post details

    fetch(`/raghav49/app/api/posts/get_post.php?id=${postId}`, {


        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
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
            alert("Failed to load blog post: " + data.message);
            window.location.href = "admin_blogs.html";
        }
    })
    .catch(error => {
        console.error("Error fetching blog post:", error);
        alert("An error occurred while fetching the blog post.");
        window.location.href = "admin_blogs.html";
    });

    // Handle form submission for updating the blog post
    editBlogForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("postTitle").value.trim();
        const content = document.getElementById("postContent").value.trim();
        const category = document.getElementById("postCategory").value.trim();
        const tags = document.getElementById("postTags").value.trim();

        if (!title || !content || !category || !tags) {
            alert("All fields are required.");
            return;
        }

        const formData = new URLSearchParams();
        formData.append("post_id", postId);
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category", category);
        formData.append("tags", tags);


        fetch("/raghav49/app/api/posts/update_post.php", {

      

            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Blog post updated successfully!");
                window.location.href = "admin_blogs.html";
            } else {
                alert("Failed to update blog post: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error updating blog post:", error);
            alert("An error occurred while updating the blog post.");
        });
    });

});

