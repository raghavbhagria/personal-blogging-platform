document.addEventListener("DOMContentLoaded", function () {
    const postTitle = document.getElementById("postTitle");
    const postImage = document.getElementById("postImage");
    const postContent = document.getElementById("postContent");
    const postAuthor = document.getElementById("postAuthor");
    const commentsList = document.getElementById("commentsList");
    const commentInput = document.getElementById("commentInput");
    const postCommentBtn = document.getElementById("postCommentBtn");

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
        alert("Post ID is missing.");
        window.location.href = "posts.html";
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("You need to be logged in to view this post.");
        window.location.href = "login.html";
        return;
    }

    fetch(`../api/posts/get_post.php?id=${postId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const post = data.post;
            postTitle.textContent = post.title;
            postContent.textContent = post.content;
            postAuthor.textContent = `Posted by ${post.author} on ${new Date(post.created_at).toLocaleDateString()}`;

            if (post.image_path) {
                postImage.src = `../uploads/${post.image_path}`;
                postImage.style.display = "block";
            }

            displayComments(post.comments);
        } else {
            alert("Failed to load post: " + data.message);
            window.location.href = "posts.html";
        }
    })
    .catch(error => {
        console.error("Error fetching post:", error);
        alert("An error occurred while fetching the post.");
        window.location.href = "posts.html";
    });

    postCommentBtn.addEventListener("click", function () {
        const commentText = commentInput.value.trim();

        if (!commentText) {
            alert("Comment cannot be empty!");
            return;
        }

        fetch("../api/comments/add_comment.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            },
            body: new URLSearchParams({
                post_id: postId,
                comment: commentText
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                commentInput.value = "";
                displayComments(data.comments);
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error("Error adding comment:", error));
    });

    function displayComments(comments) {
        commentsList.innerHTML = "";

        if (comments.length === 0) {
            commentsList.innerHTML = "<p>No comments yet.</p>";
            return;
        }

        comments.forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            commentElement.innerHTML = `
                <strong>${comment.name}</strong>: ${comment.comment} <br>
                <small>${new Date(comment.created_at).toLocaleString()}</small>
            `;
            commentsList.appendChild(commentElement);
        });
    }
});