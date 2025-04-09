document.addEventListener("DOMContentLoaded", function () {
    const categoryTabs = document.querySelectorAll(".category-tab");
    const userPostsContainer = document.getElementById("userPostsContainer");
    const paginationContainer = document.getElementById("pagination");
    let currentPage = 1;
    const postsPerPage = 12;
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view your posts.");
        window.location.href = "login.html";
        return;
    }

    function fetchUserPostsByCategoryAndPage(category, page) {
        userPostsContainer.innerHTML = "<p>Loading...</p>";

        fetch(`/personal-blogging-platform/app/api/posts/get_user_posts.php?category=${category}&page=${page}&limit=${postsPerPage}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                displayUserPosts(data.posts);
                setupPagination(data.totalPages, category);
            } else {
                userPostsContainer.innerHTML = "<p>No posts found.</p>";
            }
        })
        .catch(error => {
            userPostsContainer.innerHTML = "<p>An error occurred while fetching posts.</p>";
        });
    }

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
                    <button class="like-btn" data-post-id="${post.id}">❤️ Like (<span id="likes-count-${post.id}">${post.likes || 0}</span>)</button>
                </div>
                <div class="comments-section">
                    <h4>Comments</h4>
                    <div id="comments-${post.id}" class="comments-list">Loading comments...</div>
                    <textarea id="comment-input-${post.id}" placeholder="Write a comment..."></textarea>
                    <button class="comment-btn" data-post-id="${post.id}">Post Comment</button>
                </div>
            `;

            userPostsContainer.appendChild(postElement);

            fetchComments(post.id);
            fetchLikes(post.id);
        });

        attachEventListeners();
    }

    function setupPagination(totalPages, category) {
        paginationContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.classList.add("pagination-btn");
            if (i === currentPage) {
                button.classList.add("active");
            }
            button.addEventListener("click", function () {
                currentPage = i;
                fetchUserPostsByCategoryAndPage(category, currentPage);
            });
            paginationContainer.appendChild(button);
        }
    }

    function attachEventListeners() {
        const likeButtons = document.querySelectorAll(".like-btn");
        const commentButtons = document.querySelectorAll(".comment-btn");

        likeButtons.forEach(button => {
            button.addEventListener("click", function () {
                const postId = this.getAttribute("data-post-id");
                likePost(postId);
            });
        });

        commentButtons.forEach(button => {
            button.addEventListener("click", function () {
                const postId = this.getAttribute("data-post-id");
                addComment(postId);
            });
        });
    }

    function likePost(postId) {
        fetch("/personal-blogging-platform/app/api/posts/like_post.php", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ post_id: postId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById(`likes-count-${postId}`).textContent = data.likes;
            } else {
                alert("Failed to like post: " + data.error);
            }
        })
        .catch(error => {
            alert("An error occurred while liking the post.");
        });
    }

    function addComment(postId) {
        const commentInput = document.getElementById(`comment-input-${postId}`);
        const commentText = commentInput.value.trim();

        if (!commentText) {
            alert("Comment cannot be empty!");
            return;
        }

        fetch("/personal-blogging-platform/app/api/comments/add_comment.php", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded"
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
                const commentsContainer = document.getElementById(`comments-${postId}`);
                const newComment = `
                    <div class="comment">
                        <strong>You</strong>: ${commentText} <br>
                        <small>Just now</small>
                    </div>
                `;
                commentsContainer.innerHTML = newComment + commentsContainer.innerHTML;
            } else {
                alert("Failed to add comment: " + data.error);
            }
        })
        .catch(error => {
            alert("An error occurred while adding the comment.");
        });
    }

    function fetchComments(postId) {
        fetch(`/personal-blogging-platform/app/api/comments/get_comments.php?post_id=${postId}`)
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
            document.getElementById(`comments-${postId}`).innerHTML = "<p>Failed to load comments.</p>";
        });
    }

    function fetchLikes(postId) {
        fetch(`/personal-blogging-platform/app/api/posts/get_likes.php?post_id=${postId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                document.getElementById(`likes-count-${postId}`).textContent = data.likes;
            }
        })
        .catch(error => {});
    }

    window.editPost = function (postId) {
        window.location.href = `editPost.html?post_id=${postId}`;
    };

    window.deletePost = function (postId) {
        if (!confirm("Are you sure you want to delete this post?")) {
            return;
        }

        fetch("/personal-blogging-platform/app/api/posts/delete_post.php", {
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
                alert("Post deleted successfully!");
                fetchUserPostsByCategoryAndPage("all", 1);
            } else {
                alert("Failed to delete post: " + data.message);
            }
        })
        .catch(error => {
            alert("An error occurred while deleting the post.");
        });
    };

    categoryTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            categoryTabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            const selectedCategory = this.getAttribute("data-category");
            currentPage = 1;
            fetchUserPostsByCategoryAndPage(selectedCategory, currentPage);
        });
    });

    fetchUserPostsByCategoryAndPage("all", 1);
});