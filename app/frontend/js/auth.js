document.addEventListener("DOMContentLoaded", function () {
    console.log("🔹 auth.js loaded");

    
    // Load Navbar First
fetch("/personal-blogging-platform/app/frontend/pages/navbar.html")
.then(response => response.text())
.then(html => {
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
        navbarContainer.innerHTML = html;
        updateNavbar(); // Update navbar based on login state
    }


            // Add search functionality
            const navbarSearchForm = document.getElementById("navbarSearchForm");
            const navbarSearchQuery = document.getElementById("navbarSearchQuery");

            if (navbarSearchForm && navbarSearchQuery) {
                navbarSearchForm.addEventListener("submit", function (event) {
                    event.preventDefault();
                    const query = navbarSearchQuery.value.trim();
                    if (query) {
                        // Redirect to search.html with the query as a parameter
                        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
                    }
                });

                // Add input event listener for real-time search
                navbarSearchQuery.addEventListener("input", function () {
                    const query = navbarSearchQuery.value.trim();
                    if (query) {
                        searchAndHighlight(query);
                    } else {
                        clearHighlights();
                    }
                });
            }
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

// Search and highlight function
function searchAndHighlight(query) {
    const posts = document.querySelectorAll(".post-content");
    posts.forEach(post => {
        const regex = new RegExp(`(${query})`, "gi");
        post.innerHTML = post.innerHTML.replace(regex, '<span class="highlight">$1</span>');
    });
}

// Clear highlights function
function clearHighlights() {
    const posts = document.querySelectorAll(".post-content");
    posts.forEach(post => {
        post.innerHTML = post.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/gi, '$1');
    });
}

// ✅ Register User Function
function registerUser() {
    console.log("🔹 Registering User...");

    const registerForm = document.getElementById("registerForm");
    const formData = new FormData(registerForm); // Includes all fields & file automatically

    fetch("/personal-blogging-platform/app/api/auth/register.php", {
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

    fetch("/personal-blogging-platform/app/api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.text(); // Get response as text
    })
    .then(text => {
        try {
            const data = JSON.parse(text); // Try to parse JSON
            if (data.status === "success") {
                localStorage.setItem("token", data.token); 
                localStorage.setItem("user", JSON.stringify(data.user)); // Store user data
                alert("Login successful! Redirecting...");
                if (data.user.isAdmin) {
                    window.location.href = "admin.html"; // Redirect to admin dashboard
                } else {
                    window.location.href = "home.html"; // Redirect to user dashboard
                }
            } else {
                showError("Login failed: " + data.message);
            }
        } catch (error) {
            showError("❌ Error: Invalid JSON response");
            console.error("Invalid JSON response:", text);
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
    const profilePicSmall = document.getElementById("profilePicSmall"); // Small Profile Picture

    if (!dashboardLink || !profileLink || !createPostLink || !loginLink || !registerLink || !logoutBtn || !profilePicSmall) return;

    if (token && user) {
        // ✅ User is logged in → Show "Profile", "Create Post", "Logout", and Profile Picture, Hide "Login" & "Sign Up"
        profileLink.style.display = "inline";
        createPostLink.style.display = "inline";
        logoutBtn.style.display = "inline";
        profilePicSmall.style.display = "inline";

        // Set the profile picture (check if the user has a profile image and set the correct path)
        if (user.profile_image) {
            profilePicSmall.src = `/personal-blogging-platform/app/frontend/uploads/${user.profile_image}`;

        } else {
            profilePicSmall.src = "/personal-blogging-platform/app/frontend/assets/default-profile.png"; // Default image if no profile picture
        }

        loginLink.style.display = "none";
        registerLink.style.display = "none";
    } else {
        // ❌ User is NOT logged in → Show "Login" & "Sign Up", Hide "Profile", "Create Post", "Logout", and Profile Picture
        profileLink.style.display = "none";
        createPostLink.style.display = "none";
        logoutBtn.style.display = "none";
        profilePicSmall.style.display = "none";

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
    window.location.href = "/personal-blogging-platform/index.php";
}

// ✅ Utility Functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(message) {
    alert(message); // Replace with a UI error message if needed
}