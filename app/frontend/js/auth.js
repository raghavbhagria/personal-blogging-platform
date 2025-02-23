document.addEventListener("DOMContentLoaded", function () {
    console.log("🔹 auth.js loaded");

    // Handle Registration Form
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            registerUser();
        });
    }

    // Handle Login Form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            loginUser();
        });
    }

    // Check user authentication for protected pages
    checkUserAuthentication();
});

// ✅ Register User Function
function registerUser() {
    console.log("🔹 Registering User...");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const profileImage = document.getElementById("profileImage").files[0];

    if (!name || !email || !password) {
        showError("All fields are required.");
        return;
    }

    if (!validateEmail(email)) {
        showError("Invalid email format.");
        return;
    }

    if (password.length < 8) {
        showError("Password must be at least 8 characters long.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (profileImage) {
        formData.append("profileImage", profileImage);
    }

    fetch("../api/auth/register.php", { // Ensure correct API path
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Registration successful! Redirecting to login.");
            window.location.href = "login.html"; 
        } else {
            showError("Registration failed: " + data.message);
        }
    })
    .catch(error => showError("❌ Error: " + error.message));
}

// ✅ Login User Function
function loginUser() {
    console.log("🔹 Logging in...");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showError("Please enter email and password.");
        return;
    }

    fetch("../api/auth/login.php", { // Ensure correct path
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html"; 
        } else {
            showError("Login failed: " + data.message);
        }
    })
    .catch(error => showError("❌ Error: " + error.message));
}

// ✅ Check if User is Authenticated
function checkUserAuthentication() {
    const token = localStorage.getItem("token");
    const protectedPages = ["dashboard.html", "admin.html"];

    if (!token && protectedPages.includes(window.location.pathname.split("/").pop())) {
        window.location.href = "login.html";
    }
}

// ✅ Logout User
function logoutUser() {
    localStorage.removeItem("token");
    alert("Logged out successfully.");
    window.location.href = "login.html";
}

// ✅ Utility Functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(message) {
    alert(message); // Change this to a proper UI error message if needed
}
