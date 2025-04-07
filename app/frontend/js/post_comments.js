document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("post_id");

    const postTitle = document.getElementById("postTitle");
    const postAuthor = document.getElementById("postAuthor");
    const postDate = document.getElementById("postDate");
    const postCommentsTableBody = document.getElementById("postCommentsTableBody");

    if (!token) {
        alert("You must be logged in as an admin to access this page.");
        window.location.href = "login.html";
        return;
    }

    if (!postId) {
        alert("Post ID is required.");
        window.location.href = "admin_blogs.html";
        return;
    }

    // Fetch post details

    fetch(`/raghav49/app/api/posts/get_post.php?id=${postId}`, {

   

        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const post = data.post;
            postTitle.textContent = post.title;
            postAuthor.textContent = post.author;
            postDate.textContent = new Date(post.created_at).toLocaleDateString();
        } else {
            alert("Failed to fetch post details: " + data.message);
            window.location.href = "admin_blogs.html";
        }
    })
    .catch(error => console.error("Error fetching post details:", error));

    // Fetch comments for the post

    fetch(`/raghav49/app/api/comments/get_comments.php?post_id=${postId}`, {

   

        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            postCommentsTableBody.innerHTML = ""; // Clear table before inserting new data
            data.comments.forEach(comment => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${comment.author}</td>
                    <td>${comment.comment}</td>
                    <td>${new Date(comment.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteComment(${comment.id})">Delete</button>
                    </td>
                `;
                postCommentsTableBody.appendChild(row);
            });
        } else {
            alert("Failed to fetch comments: " + data.message);
        }
    })
    .catch(error => console.error("Error fetching comments:", error));

    // Delete a comment
    window.deleteComment = function (commentId) {
        if (!confirm("Are you sure you want to delete this comment?")) {
            return;
        }


        fetch("/raghav49/app/api/comments/delete_comment.php", {

            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ comment_id: commentId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Comment deleted successfully!");
                window.location.reload();
            } else {
                alert("Failed to delete comment: " + data.message);
            }
        })
        .catch(error => console.error("Error deleting comment:", error));
    };
});