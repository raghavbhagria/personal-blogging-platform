document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Profile Page Loaded");

    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");
    const userJoinedElement = document.getElementById("userJoined");
    const updateProfileForm = document.getElementById("updateProfileForm");
    const deleteAccountBtn = document.getElementById("deleteAccountBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const userId = localStorage.getItem("user_id");

    if (!userId) {
        alert("You must be logged in to access the profile.");
        window.location.href = "login.html";
        return;
    }

    // ✅ Fetch User Info
    fetch("../api/user.php?user_id=" + userId)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                userNameElement.textContent = data.user.name;
                userEmailElement.textContent = data.user.email;
                userJoinedElement.textContent = new Date(data.user.created_at).toLocaleDateString();
            } else {
                console.error("❌ Error fetching user info:", data.message);
            }
        })
        .catch(error => console.error("❌ Error fetching user:", error));

    // ✅ Handle Profile Update
    updateProfileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const newName = document.getElementById("newName").value.trim();
        const newEmail = document.getElementById("newEmail").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();

        if (!newName && !newEmail && !newPassword) {
            alert("Please enter at least one field to update.");
            return;
        }

        const updateData = { user_id: userId };
        if (newName) updateData.name = newName;
        if (newEmail) updateData.email = newEmail;
        if (newPassword) updateData.password = newPassword;

        fetch("../api/update_user.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Profile updated successfully!");
                location.reload();
            } else {
                alert("Error updating profile: " + data.message);
            }
        })
        .catch(error => console.error("❌ Error updating profile:", error));
    });

    // ✅ Handle Delete Account
    deleteAccountBtn.addEventListener("click", function () {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        fetch("../api/delete_user.php?user_id=" + userId, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Account deleted successfully.");
                    localStorage.clear();
                    window.location.href = "register.html";
                } else {
                    alert("Error deleting account: " + data.message);
                }
            })
            .catch(error => console.error("❌ Error deleting account:", error));
    });

    // ✅ Logout Function
    // ✅ Logout Functionality
logoutBtn.addEventListener("click", function () {
    localStorage.clear(); // Remove user data
    alert("Logged out successfully.");
    window.location.href = "home.html"; // Redirect to home page
});

});
