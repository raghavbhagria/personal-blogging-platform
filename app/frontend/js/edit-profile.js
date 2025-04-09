document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    const editForm = document.getElementById("editProfileForm");
    const newName = document.getElementById("newName");
    const newEmail = document.getElementById("newEmail");
    const newPassword = document.getElementById("newPassword");
    const newProfileImage = document.getElementById("newProfileImage");
    const currentProfileImage = document.getElementById("currentProfileImage");

    const cancelEditBtn = document.getElementById("cancelEditBtn");

    // ⬇️ Load current user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        newName.value = user.name;
        newEmail.value = user.email;
        currentProfileImage.src = `../uploads/${user.profile_image}`;
    }

    // ⬇️ Handle form submission
    editForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", newName.value);
        formData.append("email", newEmail.value);
        if (newPassword.value) {
            formData.append("password", newPassword.value);
        }
        if (newProfileImage.files.length > 0) {
            formData.append("profile_image", newProfileImage.files[0]);
        }

        fetch("/personal-blogging-platform/app/api/user/update_profile.php", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {
                alert("✅ Profile updated!");
            
                // 🧠 Optional: if backend gave updated filename, patch it into localStorage user
                if (data.profile_image && user) {
                    user.profile_image = data.profile_image;
                }
            
                // 🔄 Re-fetch updated user data...
                fetch("/personal-blogging-platform/app/api/auth/profile.php", {
            
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then(profileData => {
                    if (profileData.status === "success") {
                        localStorage.setItem("user", JSON.stringify(profileData.user));
                        window.location.href = "profile.html";
                    } else {
                        alert("⚠️ Failed to refresh profile.");
                        window.location.href = "profile.html";
                    }
                })
                .catch(err => {
                    console.error("⚠️ Error fetching updated profile:", err);
                    alert("⚠️ Failed to refresh profile.");
                    window.location.href = "profile.html";
                });

            } else {
                alert("❌ " + data.message);
            }
        })
        .catch((err) => {
            console.error("Update failed:", err);
            alert("❌ Something went wrong!");
        });
    });

    // ⬇️ Cancel button
    cancelEditBtn.addEventListener("click", function () {
        window.location.href = "profile.html";
    });
});
