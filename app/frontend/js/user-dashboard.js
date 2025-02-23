document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Fetch and display feed posts
    fetch("../api/posts/feed.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const feedContainer = document.getElementById("feedContainer");
        data.posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <a href="post.html?id=${post.id}">Read More</a>
            `;
            feedContainer.appendChild(postElement);
        });
    })
    .catch(error => console.error("Error fetching feed posts:", error));

    // Handle create post form submission
    document.getElementById("createPostForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("postTitle").value;
        const content = document.getElementById("postContent").value;

        const formData = new URLSearchParams();
        formData.append("title", title);
        formData.append("content", content);

        fetch("../api/posts/create.php", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Post created successfully");
                window.location.reload();
            } else {
                alert("Failed to create post: " + data.message);
            }
        })
        .catch(error => console.error("Error creating post:", error));
    });

    // Fetch and display featured posts
    fetch("../api/posts/featured.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const featuredPostsContainer = document.getElementById("featuredPostsContainer");
        data.posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <a href="post.html?id=${post.id}">Read More</a>
            `;
            featuredPostsContainer.appendChild(postElement);
        });
    })
    .catch(error => console.error("Error fetching featured posts:", error));

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("token");
        alert("Logged out successfully.");
        window.location.href = "login.html";
    });
});