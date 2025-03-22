document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Fetch and display users
    fetch("/personal-blogging-platform/app/api/user/listUsers.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.text())
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

    // Add User Modal functionality
    const addUserBtn = document.getElementById("addUserBtn");
    const addUserModal = document.getElementById("addUserModal");
    const addClose = document.getElementById("addClose");

    if (addUserBtn) {
        addUserBtn.addEventListener("click", function() {
            // Clear fields before opening modal
            document.getElementById("addName").value = "";
            document.getElementById("addEmail").value = "";
            document.getElementById("addPassword").value = "";
            document.getElementById("addIsAdmin").checked = false;
            addUserModal.style.display = "block";
        });
    } else {
        console.error("addUserBtn not found in the DOM!");
    }

    addClose.addEventListener("click", function() {
        addUserModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === addUserModal) {
            addUserModal.style.display = "none";
        }
        if (event.target === document.getElementById("editUserModal")) {
            document.getElementById("editUserModal").style.display = "none";
        }
    });

    // Add User Modal form submission
    document.getElementById("addUserModalForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("addName").value;
        const email = document.getElementById("addEmail").value;
        const password = document.getElementById("addPassword").value;
        const isAdmin = document.getElementById("addIsAdmin").checked ? "1" : "0";

        const formData = new URLSearchParams();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("isAdmin", isAdmin);

        fetch("/personal-blogging-platform/app/api/user/addUser.php", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.text())
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

    // EDIT USER FORM SUBMISSION: Added listener to update user details
    document.getElementById("editUserForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const id = document.getElementById("editUserId").value;
        const name = document.getElementById("editName").value;
        const email = document.getElementById("editEmail").value;
        const isAdmin = document.getElementById("editIsAdmin").checked ? "1" : "0";

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
        .then(response => response.text())
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

    // Edit User Modal close button
    const editUserModal = document.getElementById("editUserModal");
    const editClose = document.getElementById("editClose");

    editClose.addEventListener("click", function() {
        editUserModal.style.display = "none";
    });
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
        .then(response => response.text())
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
