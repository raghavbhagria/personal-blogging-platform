document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Profile Page Loaded");

    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");
    const userJoinedElement = document.getElementById("userJoined"); // REMOVE this if `created_at` isn't returned
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

            // ✅ Ensure userJoinedElement is only updated if `created_at` exists
            if (data.user.created_at) {
                userJoinedElement.textContent = new Date(data.user.created_at).toLocaleDateString();
            } else {
                console.warn("⚠ `created_at` field is missing from API response.");
                userJoinedElement.textContent = "N/A";
            }
        } else {
            console.error("❌ Error fetching user info:", data.message);
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    })
    .catch(error => {
        console.error("❌ Network or Server Error:", error);
        alert("Error fetching user data. Try again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    // ✅ Logout Function
    document.addEventListener("click", function (event) {
        if (event.target.id === "logoutBtn") {
            localStorage.clear();
            alert("Logged out successfully.");
            window.location.href = "home.html";
        }
    });
});
