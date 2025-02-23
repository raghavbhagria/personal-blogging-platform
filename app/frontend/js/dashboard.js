document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Dashboard loaded");

    const welcomeMessage = document.getElementById("welcomeMessage");
    const userPosts = document.getElementById("userPosts");
    const logoutBtn = document.getElementById("logoutBtn");
    const userId = localStorage.getItem("user_id"); 
    const username = localStorage.getItem("username"); 

    // ✅ Display Hello Message
    if (username) {
        welcomeMessage.textContent = `Hello, ${username}!`;
    } else {
        welcomeMessage.textContent = "Hello, User!";
    }

    // ✅ Fetch User's Posts
    fetch(`../api/posts.php?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log("✅ User Posts:", data);

            if (data.status === "success") {
                userPosts.innerHTML = ""; // Clear previous content

                if (data.posts.length === 0) {
                    userPosts.innerHTML = "<p>No posts yet. Start writing your first blog!</p>";
                } else {
                    data.posts.forEach(post => addPostToDashboard(post));
                }
            } else {
                console.error("❌ Error fetching user posts:", data.message);
            }
        })
        .catch(error => console.error("❌ Error fetching posts:", error));

    // ✅ Function to Add Posts to Dashboard
    function addPostToDashboard(post) {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.innerHTML = `
            <h4>${post.title}</h4>
            <p>${post.content}</p>
            <small>Posted on: ${new Date(post.created_at).toLocaleString()}</small>
        `;
        userPosts.prepend(postElement);
    }

    // ✅ Logout Function
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        alert("Logged out successfully.");
        window.location.href = "login.html";
    });
});
