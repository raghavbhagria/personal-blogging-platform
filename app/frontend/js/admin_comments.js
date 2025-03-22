document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const commentsTableBody = document.getElementById("commentsTableBody");

    if (!token) {
        alert("You must be logged in as an admin to access this page.");
        window.location.href = "login.html";
        return;
    }


    fetch("/personal-blogging-platform/app/api/comments/get_all_comments.php", {


        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            commentsTableBody.innerHTML = ""; // Clear table before inserting new data
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
                commentsTableBody.appendChild(row);
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


        fetch("/personal-blogging-platform/app/api/comments/delete_comment.php", {


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

