"use strict";
// Author Name: Nirmal Patel, Jalpan Patel
// Group 9
// Date: 21/2/25
// Description: This is the auth TypeScript file for the website which
// fetches data from users.json and validates login credentials.
// Wait until the page is fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    // Get references to the login form, message area, and authentication elements
    const loginForm = document.getElementById("loginForm");
    const messageArea = document.getElementById("messageArea");
    const authDropdown = document.getElementById("authDropdown");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const username = localStorage.getItem("username");
    // Update UI based on authentication state
    if (isLoggedIn && username) {
        if (authDropdown)
            authDropdown.style.display = "block";
        if (loginButton)
            loginButton.style.display = "none";
    }
    else {
        if (authDropdown)
            authDropdown.style.display = "none";
        if (loginButton)
            loginButton.style.display = "block";
    }
    // Restrict access to the statistics page
    if (window.location.pathname.includes("statistics.html")) {
        if (!isLoggedIn) {
            alert("❌ You must be logged in to view this page.");
            window.location.href = "./login.html"; // Redirect to login page
        }
    }
    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            window.location.href = "/login.html"; // Redirect to login page
        });
    }
    // If the login form exists, add a submit event listener
    if (loginForm && messageArea) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission
            const usernameInput = document.getElementById("username");
            const passwordInput = document.getElementById("password");
            if (!usernameInput || !passwordInput) {
                console.error("Username or password fields not found.");
                return;
            }
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            if (!username || !password) {
                showMessage("⚠️ Please enter both username and password!", "danger");
                return;
            }
            try {
                console.log("Fetching users.json...");
                const response = await fetch("/data/users.json");
                if (!response.ok) {
                    throw new Error("Failed to load user data.");
                }
                const users = await response.json();
                console.log("Users loaded:", users);
                const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
                if (user) {
                    console.log("✅ Login successful for:", user.username);
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("username", username);
                    showWelcomePopup(username);
                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 2000);
                }
                else {
                    console.log("❌ Invalid credentials");
                    showMessage("❌ Invalid username or password!", "danger");
                }
            }
            catch (error) {
                console.error("Login error:", error);
                showMessage("❌ An error occurred. Please try again later.", "danger");
            }
        });
    }
    // Function to display a message to the user
    function showMessage(message, type) {
        if (messageArea) {
            messageArea.innerHTML = `<div style="color: red;">${message}</div>`;
            messageArea.classList.remove("d-none");
        }
    }
    // Function to display a pop-up message when login is successful
    function showWelcomePopup(username) {
        const popup = document.createElement("div");
        popup.innerText = `🎉 Welcome, ${username}!`;
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.backgroundColor = "#4CAF50";
        popup.style.color = "white";
        popup.style.padding = "20px";
        popup.style.fontSize = "18px";
        popup.style.borderRadius = "10px";
        popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)";
        popup.style.zIndex = "1000";
        document.body.appendChild(popup);
        setTimeout(() => {
            popup.style.display = "none";
        }, 2000);
    }
});
//# sourceMappingURL=auth.js.map