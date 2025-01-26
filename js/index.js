<!--
    Author Names: Nirmal Patel, Jalpan Patel
    Group: 9
    Date: 23/1/25
    Description:
        The website's opportunities page dynamically displays volunteer possibilities thanks
        to this JavaScript code. A list of forthcoming events is displayed on the website, and users
        can register for events using a modal form. The title, description, date, time, and location of
        each event are displayed, and users can view and submit their information to register for that particular event.
        Additionally, the website offers a smooth event sign-up experience with Bootstrap's modal capabilities.
-->


document.addEventListener("DOMContentLoaded", () => {
    const opportunitiesContainer = document.getElementById('opportunitiesContainer');
    const signUpModal = new bootstrap.Modal(document.getElementById('signUpModal'));
    const signUpForm = document.getElementById('signUpForm');
    const signUpButton = document.getElementById('signUpButton');

    const opportunities = [
        {
            title: "City Charity Run",
            description: "Join us for the City Charity Run and support a good cause while getting some exercise.",
            date: "2025-03-20",
            time: "8:00 AM - 12:00 PM",
            location: "Downtown Park",
        },
        {
            title: "Park Cleanup Initiative",
            description: "Help clean and beautify Maple Leaf Park with fellow community members.",
            date: "2025-04-15",
            time: "9:00 AM - 1:00 PM",
            location: "Maple Leaf Park",
        },
        {
            title: "Charity Auction",
            description: "Assist with the setup, bidding process, and distribution at the Charity Auction event.",
            date: "2025-06-01",
            time: "1:00 PM - 5:00 PM",
            location: "Riverside Convention Center",
        },
        {
            title: "Digital Literacy Workshop",
            description: "Support a workshop to improve digital skills for the community.",
            date: "2025-07-10",
            time: "10:00 AM - 3:00 PM",
            location: "Tech Hub",
        },
        {
            title: "Community Beach Cleanup",
            description: "Volunteer to help clean up the beautiful Sunset Beach and protect the local ecosystem.",
            date: "2025-08-20",
            time: "7:00 AM - 11:00 AM",
            location: "Sunset Beach",
        }
    ];

    // Function to render opportunities dynamically
    opportunities.forEach(opportunity => {
        const card = document.createElement('div');
        card.classList.add('col-md-4');

        card.innerHTML = `
        <div class="card">
            <img src="${opportunity.image}" class="card-img-top" alt="${opportunity.title}">
            <div class="card-body">
                <h5 class="card-title">${opportunity.title}</h5>
                <p>${opportunity.description}</p>
                <p><strong>Date:</strong> ${opportunity.date}</p>
                <p><strong>Time:</strong> ${opportunity.time}</p>
                <p><strong>Location:</strong> ${opportunity.location}</p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signUpModal" onclick="prepareSignUp('${opportunity.title}', '${opportunity.date}', '${opportunity.time}', '${opportunity.location}')">Sign Up</button>
            </div>
        </div>
        `;
        opportunitiesContainer.appendChild(card);
    });

    // Prepare the sign-up modal with event details
    window.prepareSignUp = function (title, date, time, location) {
        const signUpModalTitle = document.getElementById('signUpModalTitle');
        const eventTitle = document.getElementById('eventTitle');
        const eventDate = document.getElementById('eventDate');
        const eventTime = document.getElementById('eventTime');
        const eventLocation = document.getElementById('eventLocation');

        signUpModalTitle.innerText = "Sign Up for " + title;
        eventTitle.innerText = title;
        eventDate.innerText = "Date: " + date;
        eventTime.innerText = "Time: " + time;
        eventLocation.innerText = "Location: " + location;

        signUpButton.onclick = function () {
            const formData = new FormData(signUpForm);
            const volunteerName = formData.get("volunteerName");
            const volunteerEmail = formData.get("volunteerEmail");

            if (!volunteerName || !volunteerEmail) {
                alert("Please fill in all fields.");
                return;
            }

            alert(`Thank you, ${volunteerName}! You have signed up for the event: ${title}.\n\nWe will send more details to ${volunteerEmail}.`);

            // Optionally, clear the form and close the modal
            signUpForm.reset();
            signUpModal.hide();
        };
    };

});
