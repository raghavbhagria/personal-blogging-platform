document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Fetch and display users
    fetch("../api/user/listUsers.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.text()) // Log raw response for debugging
    .then(text => {
        console.log("🔹 Raw Response (User List):", text);
        return JSON.parse(text);
    })
    .then(data => {
        if (data.status === "success") {
            const usersTable = document.getElementById("usersTable").getElementsByTagName("tbody")[0];
            usersTable.innerHTML = ""; // Clear table before inserting new data
            data.users.forEach(user => {
                const row = usersTable.insertRow();
                row.insertCell(0).textContent = user.id;
                row.insertCell(1).textContent = user.name;
                row.insertCell(2).textContent = user.email;
                row.insertCell(3).textContent = user.isAdmin ? "Yes" : "No";
                const actionsCell = row.insertCell(4);
                actionsCell.innerHTML = `
                    <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', ${user.isAdmin})">Edit</button>
                    <button onclick="deleteUser(${user.id})">Delete</button>
                `;
            });
        } else {
            alert("Failed to fetch users: " + data.message);
        }
    })
    .catch(error => console.error("Error fetching users:", error));

    // Add user form submission
    document.getElementById("addUserForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const isAdmin = document.getElementById("isAdmin").checked ? "1" : "0"; // Ensure 1 or 0

        const formData = new URLSearchParams();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("isAdmin", isAdmin);

        fetch("../api/user/addUser.php", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.text()) // Log raw response before parsing
        .then(text => {
            console.log("🔹 Raw Response (Add User):", text);
            return JSON.parse(text);
        })
        .then(data => {
            if (data.status === "success") {
                alert("User added successfully");
                window.location.reload();
            } else {
                alert("Failed to add user: " + data.message);
            }
        })
        .catch(error => console.error("Error adding user:", error));
    });

    // Edit user form submission
    document.getElementById("editUserForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const id = document.getElementById("editUserId").value;
        const name = document.getElementById("editName").value;
        const email = document.getElementById("editEmail").value;
        const isAdmin = document.getElementById("editIsAdmin").checked ? "1" : "0"; // Ensure 1 or 0

        const formData = new URLSearchParams();
        formData.append("id", id);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("isAdmin", isAdmin);

        fetch("../api/user/editUser.php", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.text()) // Log raw response before parsing
        .then(text => {
            console.log("🔹 Raw Response (Edit User):", text);
            return JSON.parse(text);
        })
        .then(data => {
            if (data.status === "success") {
                alert("User updated successfully");
                window.location.reload();
            } else {
                alert("Failed to update user: " + data.message);
            }
        })
        .catch(error => console.error("Error updating user:", error));
    });

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("token");
        alert("Logged out successfully.");
        window.location.href = "login.html";
    });

    // Modal functionality
    const modal = document.getElementById("editUserModal");
    const span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

// Function to open Edit User modal with existing user details
function editUser(id, name, email, isAdmin) {
    const modal = document.getElementById("editUserModal");
    modal.style.display = "block";

    document.getElementById("editUserId").value = id;
    document.getElementById("editName").value = name;
    document.getElementById("editEmail").value = email;
    document.getElementById("editIsAdmin").checked = isAdmin;
}

// Function to delete a user
function deleteUser(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    if (confirm("Are you sure you want to delete this user?")) {
        const formData = new URLSearchParams();
        formData.append("id", id);

        fetch("../api/user/deleteUser.php", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.text()) // Log raw response before parsing
        .then(text => {
            console.log("🔹 Raw Response (Delete User):", text);
            return JSON.parse(text);
        })
        .then(data => {
            if (data.status === "success") {
                alert("User deleted successfully");
                window.location.reload();
            } else {
                alert("Failed to delete user: " + data.message);
            }
        })
        .catch(error => console.error("Error deleting user:", error));
    }
}
