document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in as an admin to access this page.");
        window.location.href = "login.html";
        return;
    }

    const adminSettingsForm = document.getElementById("adminSettingsForm");

    // Pre-fill the current admin email

    fetch("/raghav49/app/api/admin/get_admin_details.php", {

   

        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            document.getElementById("email").value = data.admin.email;
        } else {
            alert("Failed to fetch admin details: " + data.message);
        }
    })
    .catch(error => console.error("Error fetching admin details:", error));

    // Handle form submission for updating admin email and password
    adminSettingsForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email) {
            alert("Email is required.");
            return;
        }

        const formData = new URLSearchParams();
        formData.append("email", email);
        if (password) {
            formData.append("password", password);
        }

        fetch("/raghav49/app/api/admin/update_admin_details.php", {

    
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Admin details updated successfully!");
                window.location.reload();
            } else {
                alert("Failed to update admin details: " + data.message);
            }
        })
        .catch(error => console.error("Error updating admin details:", error));
    });

});


