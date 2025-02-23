document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Fetch user profile info
    fetch("../api/user/profile.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            document.getElementById("profilePic").src = data.user.profilePic || "../assets/default-profile.png";
            document.getElementById("userName").value = data.user.name;
            document.getElementById("userDescription").value = data.user.description;
        } else {
            alert("Failed to fetch profile info: " + data.message);
        }
    })
    .catch(error => console.error("Error fetching profile info:", error));

    // Handle save profile button click
    document.getElementById("saveProfileBtn").addEventListener("click", function () {
        const name = document.getElementById("userName").value;
        const description = document.getElementById("userDescription").value;
        const profilePicInput = document.getElementById("profilePicInput").files[0];

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (profilePicInput) {
            formData.append("profilePic", profilePicInput);
        }

        fetch("../api/user/updateProfile.php", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Profile updated successfully");
                window.location.reload();
            } else {
                alert("Failed to update profile: " + data.message);
            }
        })
        .catch(error => console.error("Error updating profile:", error));
    });

    // Fetch and display user posts
    fetch("../api/user/posts.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const userPostsContainer = document.getElementById("userPostsContainer");
        data.posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <a href="post.html?id=${post.id}">Read More</a>
            `;
            userPostsContainer.appendChild(postElement);
        });
    })
    .catch(error => console.error("Error fetching user posts:", error));

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("token");
        alert("Logged out successfully.");
        window.location.href = "login.html";
    });
});