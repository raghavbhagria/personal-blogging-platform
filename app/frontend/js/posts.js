document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM Loaded - Running posts.js");

    const postsFeed = document.getElementById("postsFeed");
    const newPostSection = document.getElementById("newPostSection");
    const postBtn = document.getElementById("postBtn");
    const postTitle = document.getElementById("postTitle");
    const postContent = document.getElementById("postContent");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    // ✅ Ensure #postsFeed exists
    if (!postsFeed) {
        console.error("❌ ERROR: Element 'postsFeed' not found in posts.html");
        return;
    }

    console.log("✅ Fetching posts from API...");

    // ✅ Fetch Posts from Database
    fetch("../api/posts.php")
        .then(response => response.json())
        .then(data => {
            console.log("✅ API Response:", data);

            if (data.status === "success") {
                postsFeed.innerHTML = ""; // Clear existing posts before inserting
                data.posts.forEach(post => addPostToFeed(post.username, post.title, post.content, post.created_at));
            } else {
                console.error("❌ Error loading posts:", data.message);
            }
        })
        .catch(error => console.error("❌ Error fetching posts:", error));

    // ✅ Function to Add Posts to Feed
    function addPostToFeed(username, title, content, createdAt) {
        console.log(`✅ Adding post: ${title} by ${username}`);

        const post = document.createElement("div");
        post.classList.add("post");
        post.innerHTML = `
            <div class="username"><strong>${username}</strong></div>
            <div class="title"><strong>${title}</strong></div>
            <div class="content">${content}</div>
            <div class="timestamp">${new Date(createdAt).toLocaleString()}</div>
        `;
        postsFeed.prepend(post); // New posts appear at the top
    }

    // ✅ Show/Hide UI Based on Login Status
    if (token) {
        document.getElementById("loginLink")?.style.display = "none";
        document.getElementById("registerLink")?.style.display = "none";
        document.getElementById("logoutBtn")?.style.display = "inline-block";
        document.getElementById("profileLink")?.style.display = "inline-block";
        if (newPostSection) newPostSection.style.display = "block"; // Allow post creation
    } else {
        document.getElementById("logoutBtn")?.style.display = "none";
        document.getElementById("profileLink")?.style.display = "none";
        if (newPostSection) newPostSection.style.display = "none"; // Hide post creation
    }

    // ✅ Handle New Post Submission
    if (postBtn) {
        postBtn.addEventListener("click", function () {
            if (!token || !userId) {
                alert("Please login to publish a post.");
                return;
            }

            const title = postTitle.value.trim();
            const content = postContent.value.trim();

            if (title === "" || content === "") {
                alert("Title and content cannot be empty.");
                return;
            }

            const postData = {
                user_id: userId,
                title: title,
                content: content
            };

            fetch("../api/posts.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    addPostToFeed("@you", title, content, new Date().toISOString());
                    postTitle.value = "";
                    postContent.value = "";
                } else {
                    console.error("❌ Error adding post:", data.message);
                }
            })
            .catch(error => console.error("❌ Error submitting post:", error));
        });
    } else {
        console.error("❌ Element 'postBtn' not found in posts.html");
    }

    // ✅ Logout Functionality
    document.getElementById("logoutBtn")?.addEventListener("click", function () {
        localStorage.removeItem("token");
        alert("Logged out successfully.");
        window.location.href = "login.html";
    });
});
