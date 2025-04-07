document.addEventListener("DOMContentLoaded", function () {
    const userPostsContainer = document.getElementById("userPostsContainer");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view your posts.");
        window.location.href = "login.html";
        return;
    }

    // Fetch user's posts
    fetch("/raghav49/app/api/posts/get_user_posts.php", {

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

    // Display user's posts
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
                <p>${post.content.substring(0, 100)}...</p>
                <small>Posted on: ${new Date(post.created_at).toLocaleDateString()}</small>
                <div class="post-actions">
                    <button class="edit-btn" onclick="editPost(${post.id})">Edit</button>
                    <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
                </div>
                <div class="likes-section">
                    <button class="like-btn" onclick="likePost(${post.id})">❤️ Like (<span id="likes-count-${post.id}">${post.likes || 0}</span>)</button>
                </div>
                <div class="comments-section">
                    <h4>Comments</h4>
                    <div id="comments-${post.id}" class="comments-list">Loading comments...</div>
                    <textarea id="comment-input-${post.id}" placeholder="Write a comment..."></textarea>
                    <button onclick="addComment(${post.id})">Post Comment</button>
                </div>
            `;

            userPostsContainer.appendChild(postElement);

            fetchComments(post.id);
            fetchLikes(post.id); // Fetch the initial likes count
        });
    }

    // Edit post function
    window.editPost = function (postId) {
        window.location.href = `editPost.html?post_id=${postId}`;
    };

    // Delete post function
    window.deletePost = function (postId) {
        if (!confirm("Are you sure you want to delete this post?")) {
            return;
        }

        fetch("/raghav49/app/api/posts/delete_post.php", {

            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ post_id: postId })
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
    };

    // Fetch comments for a post
    function fetchComments(postId) {
        fetch(`/raghav49/app/api/comments/get_comments.php?post_id=${postId}`)

            .then(response => response.json())
            .then(data => {
                const commentsContainer = document.getElementById(`comments-${postId}`);
                if (data.status === "success") {
                    commentsContainer.innerHTML = data.comments.map(comment => `
                        <div class="comment">
                            <strong>${comment.name}</strong>: ${comment.comment} <br>
                            <small>${new Date(comment.created_at).toLocaleString()}</small>
                        </div>
                    `).join("");
                } else {
                    commentsContainer.innerHTML = `<p>No comments yet.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching comments:", error);
                document.getElementById(`comments-${postId}`).innerHTML = "<p>Failed to load comments.</p>";
            });
    }

    // Add a comment to a post
    window.addComment = function (postId) {
        const commentInput = document.getElementById(`comment-input-${postId}`);
        const commentText = commentInput.value.trim();

        if (!commentText) {
            alert("Comment cannot be empty!");
            return;
        }

        fetch("/raghav49/app/api/comments/add_comment.php", {

            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                post_id: postId,
                comment: commentText
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                commentInput.value = "";
                const commentsContainer = document.getElementById(`comments-${postId}`);
                const newComment = `
                    <div class="comment">
                        <strong>You</strong>: ${commentText} <br>
                        <small>Just now</small>
                    </div>
                `;
                commentsContainer.innerHTML = newComment + commentsContainer.innerHTML;
            } else {
                alert("Failed to add comment: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error adding comment:", error);
            alert("An error occurred while adding the comment.");
        });
    };

    // Fetch likes for a post
    function fetchLikes(postId) {
        fetch(`/raghav49/app/api/posts/get_likes.php?post_id=${postId}`)

            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    document.getElementById(`likes-count-${postId}`).textContent = data.likes;
                } else {
                    console.error("Failed to fetch likes:", data.message);
                }
            })
            .catch(error => console.error("Error fetching likes:", error));
    }

    // Like a post
    window.likePost = function (postId) {
        fetch("/raghav49/app/api/posts/like_post.php", {

            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ post_id: postId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                document.getElementById(`likes-count-${postId}`).textContent = data.likes;
            } else {
                alert("Failed to like post: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error liking post:", error);
            alert("An error occurred while liking the post.");
        });
    };
});