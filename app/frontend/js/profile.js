document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Profile Page Loaded");

    // ✅ Select Elements Safely
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");
    const profileImage = document.getElementById("profileImage"); // Get the image element

    const editProfileBtn = document.getElementById("editProfileBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const token = localStorage.getItem("token");

    // ✅ Step 1: Ensure User is Logged In
    if (!token) {
        alert("⚠️ You must be logged in to access the profile.");
        window.location.href = "login.html";
        return;
    }

    // ✅ Step 2: Fetch User Info
    fetch("/personal-blogging-platform/app/api/auth/profile.php", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("🔹 API Response:", data);

        if (data.status === "success") {
            // ✅ Populate the profile details
            userNameElement.textContent = data.user.name;
            userEmailElement.textContent = data.user.email;

            // Set the profile image
            if (data.user.profile_image) {
                profileImage.src = `../uploads/${data.user.profile_image}`; // Adjust path as needed
            } else {
                profileImage.src = '../assets/default-profile.png'; // Set a default image
            }

            // Update localStorage with the latest user data
            localStorage.setItem("user", JSON.stringify(data.user));
            updateNavbar(); // Update the navbar with the new profile picture
        } else {
            console.error("⚠️ Session expired. Logging out.");
            alert("⚠️ Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    })
    .catch(error => {
        console.error("⚠️ Error fetching user data:", error);
        alert("⚠️ Error fetching user data. Try again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
    
    // ✅ Step 3: Add "Edit Profile" Button Functionality
    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", function () {
            console.log("🔹 Navigating to Edit Profile Page");
            window.location.href = "edit-profile.html"; // ✅ Redirect to Edit Profile
        });
    }

    // ✅ Step 4: Add "Logout" Button Functionality
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            console.log("🔹 Logging out user");
            localStorage.clear();
            alert("✅ Logged out successfully.");
            window.location.href = "login.html"; // ✅ Redirect to login page
        });
    }
});
