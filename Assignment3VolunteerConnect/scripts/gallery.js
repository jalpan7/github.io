"use strict";
// Author Name: Nirmal Patel, Jalpan Patel
// Group 9
// Date: 21/2/25
// Description: This is the gallery TypeScript file for the website which shows
// the picture with a description about the picture used in the assignment.
// Wait until the page is fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from the gallery.json file
    fetch("../data/gallery.json")
        .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to load gallery data.");
        }
        return response.json();
    })
        .then((images) => {
        // Get the gallery container element
        const galleryContainer = document.getElementById("gallery-container");
        // Check if the gallery container exists
        if (!galleryContainer) {
            console.error("Gallery container not found.");
            return;
        }
        // Loop through the images and create HTML elements for each image
        images.forEach((image) => {
            // Create a column div for the image
            const colDiv = document.createElement("div");
            colDiv.className = "col-md-4 mb-4";
            // Create a link element for the image
            const link = document.createElement("a");
            link.href = image.src;
            link.setAttribute("data-lightbox", "gallery");
            link.setAttribute("data-title", image.title);
            link.setAttribute("data-bs-toggle", "modal");
            link.setAttribute("data-bs-target", "#imageModal");
            // Add a click event listener to the link
            link.addEventListener("click", function () {
                // Set the modal content when the image is clicked
                const modalTitle = document.getElementById("imageModalLabel");
                const modalImage = document.getElementById("modal-image");
                const imageDescription = document.getElementById("image-description");
                if (modalTitle && modalImage && imageDescription) {
                    modalTitle.textContent = image.title;
                    modalImage.src = image.src;
                    imageDescription.textContent = `Description: ${image.title}`;
                }
                else {
                    console.error("Modal elements not found.");
                }
            });
            // Create an image element
            const img = document.createElement("img");
            img.src = image.src;
            img.alt = image.alt;
            img.className = "img-fluid gallery-img";
            // Append the image to the link and the link to the column div
            link.appendChild(img);
            colDiv.appendChild(link);
            // Append the column div to the gallery container
            galleryContainer.appendChild(colDiv);
        });
    })
        // Handle any errors that occur while fetching or processing the JSON data
        .catch((error) => console.error("Error loading gallery images:", error));
});
//# sourceMappingURL=gallery.js.map