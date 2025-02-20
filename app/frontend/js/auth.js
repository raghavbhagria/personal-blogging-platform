document.addEventListener("DOMContentLoaded", function () {
    checkAuth(); // Check login status on page load

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            loginUser();
        });
    }
});

function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // Store JWT and user info in localStorage
            localStorage.setItem("jwt", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login successful!");
            window.location.href = "dashboard.html"; // Redirect to user dashboard
        } else {
            alert("Login failed: " + data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}

function checkAuth() {
    const token = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));

    const authLinks = document.getElementById("authLinks");
    const userGreeting = document.getElementById("userGreeting");
    const userNameDisplay = document.getElementById("userNameDisplay");

    if (token && user) {
        // User is logged in, update UI
        if (authLinks) authLinks.style.display = "none";
        if (userGreeting) {
            userGreeting.style.display = "inline";
            userNameDisplay.textContent = user.name;
        }
    } else {
        // User is not logged in
        if (authLinks) authLinks.style.display = "inline";
        if (userGreeting) userGreeting.style.display = "none";
    }
}

function logoutUser() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    window.location.href = "home.html"; // Redirect to home page after logout
}
