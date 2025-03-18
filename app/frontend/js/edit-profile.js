document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Edit Profile Page Loaded");

    const profilePicElement = document.getElementById("profilePic");
    const profilePicInput = document.getElementById("profilePicInput");
    const newNameInput = document.getElementById("newName");
    const newEmailInput = document.getElementById("newEmail");
    const newPasswordInput = document.getElementById("newPassword");
    const editProfileForm = document.getElementById("editProfileForm");
    const cancelEditBtn = document.getElementById("cancelEditBtn");

    const token = localStorage.getItem("token");

    if (!token) {
        alert("⚠️ You must be logged in to edit your profile.");
        window.location.href = "login.html";
        return;
    }

    // ✅ Fetch Current Profile Data
    fetch("../api/auth/profile.php", {
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
            profilePicElement.src = data.user.profile_pic || "../assets/default-profile.png";
        } else {
            alert("⚠️ Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    })
    .catch(error => {
        alert("⚠️ Error fetching user data. Try again.");
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
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    profilePicElement.src = data.profile_pic_url;
                    alert("✅ Profile picture updated successfully.");
                } else {
                    alert("❌ Failed to update profile picture: " + data.message);
                }
            })
            .catch(error => {
                alert("❌ Error uploading profile picture. Try again.");
            });
        }
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

        fetch("../api/user/update_profile.php", {  // ✅ Correct API path
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newName,
                email: newEmail,
                password: newPassword ? newPassword : null
            })
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
        });
    });

    // ✅ Cancel Edit Button (Redirect to Profile Page)
    cancelEditBtn.addEventListener("click", function () {
        console.log("🔹 Canceling Edit. Returning to Profile.");
        window.location.href = "profile.html"; // ✅ Redirect back to Profile
    });
});
