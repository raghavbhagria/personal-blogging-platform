document.addEventListener("DOMContentLoaded", function () {
    console.log("🔹 profile.js loaded");

    const token = localStorage.getItem("token");
    if (!token) {
        console.log("❌ No token found, redirecting to login.");
        window.location.href = "login.html";
        return;
    }

    // Fetch user info from the backend
    fetch("../api/auth/profile.php", {
        method: "GET",
        headers: { 
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("🔹 User Data:", data);
        if (data.status === "success") {
            document.getElementById("userName").textContent = data.user.name;
            document.getElementById("userEmail").textContent = data.user.email;
        } else {
            console.log("❌ Session expired, redirecting to login.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    })
    .catch(error => console.error("❌ Error fetching profile:", error));

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("token");
        alert("Logged out successfully.");
        window.location.href = "login.html";
    });
});
