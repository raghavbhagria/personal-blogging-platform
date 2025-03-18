document.addEventListener("DOMContentLoaded", function () {
    const categoryTabs = document.querySelectorAll(".category-tab");
    const postsContainer = document.getElementById("postsContainer");
    const paginationContainer = document.getElementById("pagination");
    let currentPage = 1;
    const postsPerPage = 12;
    
    // ✅ Ensure token is properly retrieved
    let token = localStorage.getItem("token");
    console.log("Retrieved token:", token);

    function fetchPostsByCategoryAndPage(category, page) {
        postsContainer.innerHTML = "<p>Loading...</p>";

        fetch(`../api/posts/get_posts_by_category.php?category=${category}&page=${page}&limit=${postsPerPage}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    displayPosts(data.posts);
                    setupPagination(data.totalPages, category);
                } else {
                    postsContainer.innerHTML = "<p>No posts found for this category.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
                postsContainer.innerHTML = "<p>An error occurred while fetching posts.</p>";
            });
    }

    function displayPosts(posts) {
        postsContainer.innerHTML = "";

        if (posts.length === 0) {
            postsContainer.innerHTML = "<p>No posts found.</p>";
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <small>Posted by ${post.name} on ${new Date(post.created_at).toLocaleDateString()}</small>
                <a href="post.html?id=${post.id}" class="read-more-btn">Read More</a>

                <div class="comments-section">
                    <h4>Comments</h4>
                    <div id="comments-${post.id}" class="comments-list">Loading comments...</div>
                    <textarea id="comment-input-${post.id}" placeholder="Write a comment..."></textarea>
                    <button onclick="addComment(${post.id})">Post Comment</button>
                </div>
            `;

            postsContainer.appendChild(postElement);

            fetchComments(post.id);
        });
    }

    function fetchComments(postId) {
        fetch(`../api/comments/get_comments.php?post_id=${postId}`)
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

    function addComment(postId) {
        const commentInput = document.getElementById(`comment-input-${postId}`);
        const commentText = commentInput.value.trim();

        let token = localStorage.getItem("token"); // ✅ Ensure token retrieval
        console.log("Token being sent:", token);

        if (!token) {
            alert("You need to be logged in to comment.");
            return;
        }

        if (commentText === "") {
            alert("Comment cannot be empty!");
            return;
        }

        fetch("../api/comments/add_comment.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}` // ✅ Ensure correct header format
            },
            body: new URLSearchParams({
                post_id: postId,
                comment: commentText
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
            if (data.success) {
                commentInput.value = "";
                fetchComments(postId);
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error("Error adding comment:", error));
    }

    window.addComment = addComment;

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
                fetchPostsByCategoryAndPage(category, currentPage);
            });
            paginationContainer.appendChild(button);
        }
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            categoryTabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            const selectedCategory = this.getAttribute("data-category");
            currentPage = 1; 
            fetchPostsByCategoryAndPage(selectedCategory, currentPage);
        });
    });

    fetchPostsByCategoryAndPage("all", 1);
});
