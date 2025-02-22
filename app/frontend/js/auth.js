document.addEventListener("DOMContentLoaded", function () {
    console.log("🔹 auth.js loaded");

    // Handle Registration Form
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        console.log("🔹 Register form found");
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("🔹 Register button clicked");
            registerUser();
        });
    } else {
        console.log("❌ Register form not found");
    }

    // Handle Login Form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        console.log("🔹 Login form found");
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("🔹 Login button clicked");
            loginUser();
        });
    } else {
        console.log("❌ Login form not found");
    }
});

// ✅ Register User Function
function registerUser() {
    console.log("🔹 registerUser() function triggered");

    const name = document.getElementById("name")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const password = document.getElementById("password")?.value || "";

    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    fetch("../api/auth/register.php", { // Ensure correct path
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("🔹 API Response:", data);
        if (data.status === "success") {
            alert("Registration successful! Redirecting to login.");
            window.location.href = "login.html"; 
        } else {
            alert("Registration failed: " + data.message);
        }
    })
    .catch(error => console.error("❌ Error:", error));
}

// ✅ Login User Function
function loginUser() {
    console.log("🔹 loginUser() function triggered");

    const email = document.getElementById("email")?.value || "";
    const password = document.getElementById("password")?.value || "";

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);

    fetch("../api/auth/login.php", { // Ensure correct path
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("🔹 API Response:", data);
        if (data.status === "success") {
            localStorage.setItem("token", data.token); 
            alert("Login successful! Redirecting...");
            if (data.user.isAdmin) {
                window.location.href = "admin.html"; // Redirect to admin dashboard
            } else {
                window.location.href = "dashboard.html"; // Redirect to user dashboard
            }
        } else {
            alert("Login failed: " + data.message);
        }
    })
    .catch(error => console.error("❌ Error:", error));
}
