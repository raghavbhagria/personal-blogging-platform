document.addEventListener("DOMContentLoaded", function () {
    console.log("🔹 auth.js loaded");

    // Load Navbar First
    fetch("navbar.html") // Ensure correct path
        .then(response => response.text())
        .then(html => {
            document.getElementById("navbar-container").innerHTML = html;
            updateNavbar(); // Update navbar based on login state
        });

    // Check user authentication for protected pages
    checkUserAuthentication();

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

    // Handle Logout (Delegated to support dynamically loaded navbar)
    document.addEventListener("click", function (event) {
        if (event.target.id === "logoutButton") {
            logoutUser();
        }
    });
});

// ✅ Register User Function
function registerUser() {
    console.log("🔹 Registering User...");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
        showError("All fields are required.");
        return;
    }

    fetch("../api/auth/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
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

    fetch("../api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            localStorage.setItem("token", data.token); 
            localStorage.setItem("user", JSON.stringify(data.user)); // Store user data
            alert("Login successful! Redirecting...");
            if (data.user.isAdmin) {
                window.location.href = "admin.html"; // Redirect to admin dashboard
            } else {
                window.location.href = "dashboard.html"; // Redirect to user dashboard
            }
        } else {
            showError("Login failed: " + data.message);
        }
    })
    .catch(error => showError("❌ Error: " + error.message));
}

// ✅ Check if User is Authenticated (For Protected Pages)
function checkUserAuthentication() {
    const token = localStorage.getItem("token");
        const protectedPages = ["dashboard.html", "admin.html", "profile.html", "createPost.html"];

    if (!token && protectedPages.includes(window.location.pathname.split("/").pop())) {
        alert("You must be logged in to access this page.");
        window.location.href = "login.html";
    }
}

// ✅ Update Navbar Based on Authentication State
function updateNavbar() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const dashboardLink = document.getElementById("dashboardLink"); // Blog Posts (Always Visible)
    const profileLink = document.getElementById("profileLink"); // View Profile
    const createPostLink = document.getElementById("createPostLink"); // Create Post
    const loginLink = document.getElementById("loginLink"); // Login
    const registerLink = document.getElementById("registerLink"); // Sign Up
    const logoutBtn = document.getElementById("logoutButton"); // Logout
   

    if (!dashboardLink || !profileLink || !createPostLink || !loginLink || !registerLink || !logoutBtn  ) return;

    if (token && user) {
        // ✅ User is logged in → Show "Profile", "Create Post", "Logout", and Profile Picture, Hide "Login" & "Sign Up"
        profileLink.style.display = "inline";
        createPostLink.style.display = "inline";
        logoutBtn.style.display = "inline";
     

        loginLink.style.display = "none";
        registerLink.style.display = "none";
    } else {
        // ❌ User is NOT logged in → Show "Login" & "Sign Up", Hide "Profile", "Create Post", "Logout", and Profile Picture
        profileLink.style.display = "none";
        createPostLink.style.display = "none";
        logoutBtn.style.display = "none";
     

        loginLink.style.display = "inline";
        registerLink.style.display = "inline";
    }
}

// ✅ Ensure Navbar Updates on Page Load
document.addEventListener("DOMContentLoaded", function () {
    console.log("🔹 Updating Navbar...");
    updateNavbar();
});

// ✅ Logout User
function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully.");
    window.location.href = "home.html";
}

// ✅ Utility Functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(message) {
    alert(message); // Replace with a UI error message if needed
}