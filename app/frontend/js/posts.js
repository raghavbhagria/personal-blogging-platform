document.addEventListener("DOMContentLoaded", function () {
    const categoryTabs = document.querySelectorAll(".category-tab");
    const postsContainer = document.getElementById("postsContainer");
    const paginationContainer = document.getElementById("pagination");
    let currentPage = 1;
    const postsPerPage = 12;
    
    let token = localStorage.getItem("token");
    console.log("Retrieved token:", token);

    function fetchPostsByCategoryAndPage(category, page) {
        postsContainer.innerHTML = "<p>Loading...</p>";

        fetch(`/personal-blogging-platform/app/api/posts/get_posts_by_category.php?category=${category}&page=${page}&limit=${postsPerPage}`)
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
        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = "";
    
        if (posts.length === 0) {
            postsContainer.innerHTML = "<p>No posts found.</p>";
            return;
        }
    
        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

                        // ✅ Fetching likes dynamically to prevent incorrect display
                        let likesCount = post.likes !== null && post.likes !== undefined ? post.likes : 0;

            let postImage = "";
            if (post.image_path) {
                postImage = `<img src="/uploads/${post.image_path}" alt="Post Image" class="post-image">`;
            }
    
            postElement.innerHTML = `
            <h3>${post.title}</h3>
            ${postImage}
            <p class="post-content">${post.content.substring(0, 100)}...</p>
            <small>Posted by ${post.name} on ${new Date(post.created_at).toLocaleDateString()}</small>
            <a href="/personal-blogging-platform/app/frontend/pages/post.html?id=${post.id}" class="read-more-btn">Read More</a>


            <div class="likes-section">
                <button class="like-btn" data-post-id="${post.id}">
                    ❤️ Like (<span id="likes-count-${post.id}">${likesCount}</span>) 
                </button>
                
            </div>

            <div class="comments-section">
                <h4>Comments</h4>
                <div id="comments-${post.id}" class="comments-list">Loading comments...</div>
                <textarea id="comment-input-${post.id}" placeholder="Write a comment..."></textarea>
                <button onclick="addComment(${post.id})">Post Comment</button>
            </div>
        `;
    
            postsContainer.appendChild(postElement);
    
            fetchComments(post.id);
            fetchLikes(post.id); // ✅ Ensure correct like count is fetched

            // ✅ Ensure like event listeners are attached properly
            const likeButton = postElement.querySelector(".like-btn");
            likeButton.addEventListener("click", function () {
                likePost(post.id);
            });
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
                            <strong>${comment.author}</strong>: ${comment.comment} <br>
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

    function fetchLikes(postId) {
        fetch(`/personal-blogging-platform/app/api/posts/get_likes.php?post_id=${postId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    document.getElementById(`likes-count-${postId}`).textContent = data.likes;
                }
            })
            .catch(error => console.error("Error fetching likes:", error));
    }

    function addComment(postId) {
        const commentInput = document.getElementById(`comment-input-${postId}`);
        const commentText = commentInput.value.trim();

        let token = localStorage.getItem("token");
        console.log("Token being sent:", token);

        if (!token) {
            alert("You need to be logged in to comment.");
            return;
        }

        if (commentText === "") {
            alert("Comment cannot be empty!");
            return;
        }

        fetch("/personal-blogging-platform/app/api/comments/add_comment.php", {
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

    function likePost(postId) {
        if (!token) {
            alert("You need to be logged in to like posts.");
            return;
        }

        fetch("/personal-blogging-platform/app/api/posts/like_post.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            },
            body: new URLSearchParams({
                post_id: postId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById(`likes-count-${postId}`).textContent = data.likes;
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error("Error liking post:", error));
    }

    window.addComment = addComment;
    window.likePost = likePost;

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
