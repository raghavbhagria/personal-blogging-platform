document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Profile Page Loaded");

    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");
    const userJoinedElement = document.getElementById("userJoined");
    const profilePicElement = document.getElementById("profilePic");
    const profilePicInput = document.getElementById("profilePicInput");
    const updateProfileForm = document.getElementById("updateProfileForm");
    const deleteAccountBtn = document.getElementById("deleteAccountBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to access the profile.");
        window.location.href = "login.html";
        return;
    }

    // ✅ Fetch User Info
    fetch("../api/auth/profile.php", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("🔹 API Response:", data);

        if (data.status === "success") {
            userNameElement.textContent = data.user.name;
            userEmailElement.textContent = data.user.email;
            profilePicElement.src = data.user.profile_pic || "../assets/default-profile.png";

            if (data.user.created_at) {
                userJoinedElement.textContent = new Date(data.user.created_at).toLocaleDateString();
            } else {
                userJoinedElement.textContent = "N/A";
            }
        } else {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    })
    .catch(error => {
        alert("Error fetching user data. Try again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    // ✅ Handle Profile Picture Upload
    profilePicInput.addEventListener("change", function () {
        const file = profilePicInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("profile_pic", file);

            fetch("../api/user/uploadProfilePic.php", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    profilePicElement.src = data.profile_pic_url;
                    const user = JSON.parse(localStorage.getItem("user"));
                    user.profile_pic = data.profile_pic_url;
                    localStorage.setItem("user", JSON.stringify(user));
                    alert("Profile picture updated successfully.");
                    updateNavbar(); // Update the navbar to reflect the new profile picture
                } else {
                    alert("Failed to update profile picture: " + data.message);
                }
            })
            .catch(error => {
                alert("Error uploading profile picture. Try again.");
            });
        }
    });

    // ✅ Logout Function
    logoutBtn.addEventListener("click", function () {
        localStorage.clear();
        alert("Logged out successfully.");
        window.location.href = "home.html";
    });
});