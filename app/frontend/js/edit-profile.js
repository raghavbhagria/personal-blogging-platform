document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Edit Profile Page Loaded");

    // ✅ Select Elements Safely
    const newNameInput = document.getElementById("newName");
    const newEmailInput = document.getElementById("newEmail");
    const newPasswordInput = document.getElementById("newPassword");
    const editProfileForm = document.getElementById("editProfileForm");
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    const newProfileImageInput = document.getElementById("newProfileImage"); // Get the file input
    const currentProfileImage = document.getElementById("currentProfileImage");

    const token = localStorage.getItem("token");

    if (!token) {
        alert("⚠️ You must be logged in to edit your profile.");
        window.location.href = "login.html";
        return;
    }

    // ✅ Fetch Current Profile Data
    fetch("/ganainy/app/api/auth/profile.php", {
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
            newNameInput.value = data.user.name;
            newEmailInput.value = data.user.email;

            // Set the current profile image
            if (data.user.profile_image) {
                currentProfileImage.src = `../uploads/${data.user.profile_image}`; // Adjust path as needed
            } else {
                currentProfileImage.src = '../assets/default-profile.png'; // Set a default image
            }
        } else {
            alert("⚠️ Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    })
    .catch(error => {
        alert("⚠️ Error fetching user data. Try again.");
        console.error("⚠️ Error fetching user data:", error);
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    // ✅ Handle Profile Update Form Submission (Uses `/api/user/update_profile.php`)
    editProfileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const newName = newNameInput.value.trim();
        const newEmail = newEmailInput.value.trim();
        const newPassword = newPasswordInput.value.trim();

        if (!newName || !newEmail) {
            alert("⚠️ Name and Email cannot be empty!");
            return;
        }

        const formData = new FormData();
        formData.append("name", newName);
        formData.append("email", newEmail);
        if (newPassword) {
            formData.append("password", newPassword);
        }
        if (newProfileImageInput.files.length > 0) {
            formData.append("profile_image", newProfileImageInput.files[0]);
        }

        fetch("/ganainy/app/api/user/update_profile.php", {  // ✅ Correct API path
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData // Use FormData for file uploads
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("✅ Profile updated successfully.");
                window.location.href = "profile.html"; // ✅ Redirect to Profile Page
            } else {
                alert("❌ Failed to update profile: " + data.message);
            }
        })
        .catch(error => {
            alert("❌ Error updating profile. Try again.");
            console.error("❌ Error updating profile:", error);
        });
    });

    // ✅ Cancel Edit Button (Redirect to Profile Page)
    cancelEditBtn.addEventListener("click", function () {
        console.log("🔹 Canceling Edit. Returning to Profile.");
        window.location.href = "profile.html"; // ✅ Redirect back to Profile
    });
});
