// Author Name: Nirmal Patel, Jalpan Patel
// Group 9
// Date: 22/2/25
// Description: This is the logout TypeScript file for the website which
// handles the logout functionality by clearing localStorage and redirecting to the login page.

// Wait until the page is fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    // Get the logout button element
    const logoutButton = document.getElementById("logoutButton");

    // Check if the logout button exists
    if (logoutButton) {
        // Add a click event listener to the logout button
        logoutButton.addEventListener("click", function () {
            // Ask for confirmation before logging out
            const confirmLogout = confirm("Are you sure you want to log out?");
            if (confirmLogout) {
                try {
                    // Check if localStorage is available
                    if (typeof localStorage !== "undefined") {
                        // Check if the user is logged in
                        const isLoggedIn = localStorage.getItem("isLoggedIn");
                        if (isLoggedIn === "true") {
                            // Remove login status and username from localStorage
                            localStorage.removeItem("isLoggedIn");
                            localStorage.removeItem("username");

                            // Redirect to the login page
                            window.location.href = "/views/content/login.html";  // Corrected path to login.html
                        } else {
                            console.log("User is already logged out.");
                        }
                    } else {
                        console.error("localStorage is not supported in this browser.");
                        alert("Logout failed. Please try again.");
                    }
                } catch (error) {
                    // Handle any errors that occur during the logout process
                    console.error("Logout error:", error);
                    alert("An error occurred during logout. Please try again.");
                }
            }
        });
    } else {
        console.error("Logout button not found.");
    }
});