document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const blogsTableBody = document.getElementById("blogsTableBody");

    if (!token) {
        alert("You must be logged in as an admin to access this page.");
        window.location.href = "login.html";
        return;
    }

    // Fetch all blogs
    fetch("../api/posts/get_all_posts.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            blogsTableBody.innerHTML = ""; // Clear table before inserting new data
            data.posts.forEach(post => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${post.title}</td>
                    <td>${post.author}</td>
                    <td>${new Date(post.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="edit-btn" onclick="editBlog(${post.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteBlog(${post.id})">Delete</button>
                    </td>
                `;
                blogsTableBody.appendChild(row);
            });
        } else {
            alert("Failed to fetch blogs: " + data.message);
        }
    })
    .catch(error => console.error("Error fetching blogs:", error));

    // Delete a blog
    window.deleteBlog = function (postId) {
        if (!confirm("Are you sure you want to delete this blog post?")) {
            return;
        }

        fetch("../api/posts/delete_post.php", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ post_id: postId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Blog post deleted successfully!");
                window.location.reload();
            } else {
                alert("Failed to delete blog post: " + data.message);
            }
        })
        .catch(error => console.error("Error deleting blog post:", error));
    };

    // Edit a blog
    window.editBlog = function (postId) {
        window.location.href = `admin_edit_blog.html?post_id=${postId}`;
    };
});