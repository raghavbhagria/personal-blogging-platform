document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Profile Page Loaded");

    // DOM Elements
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");
    const profileImage = document.getElementById("profileImage");
    const editProfileBtn = document.getElementById("editProfileBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    // ✅ Step 1: Fetch user profile from session
    fetch("/raghav49/app/api/auth/profile.php", {
        method: "GET",
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        console.log("🔹 API Response:", data);

        if (data.status === "success") {
            const user = data.user;

            // ✅ Update DOM
            userNameElement.textContent = user.name;
            userEmailElement.textContent = user.email;

            // ✅ Handle profile image
            if (user.profile_image) {
                const imageUrl = `/raghav49/uploads/${user.profile_image}`;
                console.log("🖼️ Image URL:", imageUrl);

                // Test loading image and fallback if broken
                profileImage.src = imageUrl;
                profileImage.onerror = () => {
                    console.warn("⚠️ Image not found, loading default");
                    profileImage.src = '../assets/default-profile.png';
                };
            } else {
                profileImage.src = '../assets/default-profile.png';
            }

            // Store user in localStorage
            localStorage.setItem("user", JSON.stringify(user));
            updateNavbar?.();
        } else {
            console.error("⚠️ Session expired.");
            alert("⚠️ Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    })
    .catch(error => {
        console.error("❌ Failed to fetch profile:", error);
        alert("⚠️ Could not load profile.");
        window.location.href = "login.html";
    });

    // ✅ Edit Profile Redirect
    editProfileBtn?.addEventListener("click", () => {
        window.location.href = "edit-profile.html";
    });

    // ✅ Logout Functionality
    logoutBtn?.addEventListener("click", () => {
        localStorage.clear();
        alert("✅ Logged out.");
        window.location.href = "login.html";
    });
});
