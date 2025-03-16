"use scripts";



import {Router} from "./router.js";
import {LoadHeader,} from "./header.js";
import {LoadFooter} from "./footer.js";
import {AuthGuard} from "./authguard.js";


const pageTitles = {
    "/": "Home",
    "/home": "Home",
    "/about": "About Us",
    "/products": "Products",
    "/contacts": "Contacts",
    "/services": "Services",
    "/contacts-list": "Contacts-list",
    "/edit": "Edit Contact",
    "/login": "Login",
    "/register": "Register",
    "/404": "Page not found",
}

const routes = {
    "/": "views/pages/home.html",
    "/home": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/products": "views/pages/products.html",
    "/contacts": "views/pages/contacts.html",
    "/services": "views/pages/services.html",
    "/contacts-list": "views/pages/contacts-list.html",
    "/edit": "views/pages/edit.html",
    "/login": "views/pages/login.html",
    "/register": "views/pages/register.html",
    "/404": "views/pages/404.html",
}

const router = new Router(routes);

(function () {


    function DisplayLoginPage() {
        console.log("[INFO] DisplayLoginPage called...");

        if(sessionStorage.getItem("user")){
            router.navigate("/contacts-list")
        }

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");

        //Hide message area initially
        messageArea.style.display = "none";

        if (!loginButton) {
            console.error("[ERROR] loginButton not found in the DOM");
            return;
        }

        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {

                const response = await fetch("data/users.json")
                if (!response.ok) {
                    throw new Error(`[ERROR] HTTP error!. Status: ${response.status}`);

                }

                const jsonData = await response.json();
                //console.log("[DEBUG] Fetched JSON data, jasonData");

                const users = jsonData.users;
                if (!Array.isArray(users)) {
                    throw new Error(`[ERROR] JSON data does not contain a valid array.`);
                }

                let success = false;
                let authenticatedUser = null;

                for (const user of users) {
                    if (user.Username === username && user.password === password) {
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }

                if (success) {

                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        Username: authenticatedUser.Username
                    }));

                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert", "alert-danger");
                    //location.href = "contacts-list.html";
                    LoadHeader().then(() => {
                        router.navigate("/contacts-list");
                    });
                } else {
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password . Please try again.";

                    document.getElementById("username").focus();
                    document.getElementById("username").select();


                }

            } catch (error) {
                console.error("[ERROR] login failed", error);

            }

        });

        cancelButton.addEventListener("click", (event) => {
            document.getElementById("loginForm").reset();
            router.navigate("/home");
        });


    }


    function DisplayRegisterPage() {
        console.log("[INFO] DisplayRegisterPage called...");
    }


    /**
     * Redirects user back to the contact-list page
     */
    function handleCancelClick() {
        router.navigate("/contacts-list");
    }

    /**
     * Handles the process of ending an existing contact
     * @param event
     * @param contact contact to update
     * @param page unique contact identifier
     */
    function handleEditClick(event, contact, page) {
        //Prevents default form submission behaviour
        event.preventDefault();

        if (!validateForm()) {
            alert("Invalid data! please check your input ");
            return;
        }

        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        //update the contact object with the new values
        contact.fullName = fullName;
        contact.contactNumber = contactNumber;
        contact.emailAddress = emailAddress;

        //Sve the updated contact (in local storage) with the updated csv
        localStorage.setItem(page, contact.serialize());

        //redirect
        router.navigate("/contacts-list");

    }

    /**
     * Handles the process of adding a new contact
     * @param event - the event object prevent default form submission
     */
    function handleAddClick(event) {
        //Prevents default form submission behaviour
        event.preventDefault();

        if (!validateForm()) {
            alert("Form contains errors. Please correct them before submitting");
            return;
        }

        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        //Crate the correct in localstorage
        AddContact(fullName, contactNumber, emailAddress);

        //redirection
        router.navigate("/contacts-list");
    }

    /**
     * Validates the entire form by checking validity each input
     * @returns {boolean}
     */
    function validateForm() {
        return (
            validateInout("fullName") &&
            validateInout("contactNumber") &&
            validateInout("emailAddress")

        );
    }

    /**
     * Attaches validation event Listeners to form inout field dynamically
     * @param elementID
     * @param event
     * @param handler
     */

    function addEventListenersOnce(elementID, event, handler) {

        //retrieve element from DOM
        const element = document.getElementById(elementID);

        if (element) {
            //remove any existing event listeners of the same type
            element.removeEventListener(event, handler);

            //attach the new (latest) event for that element
            element.addEventListener(event, handler);


        } else {
            console.warn(`[WARN]Element with id "${elementID}" not found`);
        }

    }

    function attachValidationListeners() {
        console.log("[INFO] Attaching validation listeners...");


        Object.keys(VALIDATION_RULES).forEach((fieldID) => {

            const field = document.getElementById(fieldID);

            if (!field) {
                console.warn(`[WARN] field ${field} not found. skipping listeners`);
                return;
            }

            //Attach event listener using centralize validation method
            addEventListenersOnce(field, "input", () => validateInout(fieldID));


        });


    }

    /**
     * Validates an inout based a predefined validation rule
     * @param fieldID
     * @returns {boolean} - returns true if , false otherwise
     */

    function validateInout(fieldID) {

        const field = document.getElementById(fieldID);
        const errorElement = document.getElementById(`${fieldID}-error`);
        const rule = VALIDATION_RULES[fieldID];

        if (!field || !errorElement || !rule) {
            console.warn(`[WARN] Validation rules not found for ${fieldID}!`);
            return false;
        }

        //Check if inout is empty

        if (field.value.trim() === "") {
            errorElement.textContent = "This is a required field.";
            errorElement.style.display = "block";
            errorElement.style.marginLeft = "5px";
            return false;
        }

        // Check field against regular expression

        if (!rule.regex.test(field.value)) {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            errorElement.style.marginLeft = "5px";
            return false;
        }

        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;
    }

    /**
     * Centralize validation rules for input fields
     * @type {{fullName: {regex: RegExp, errorMessage: string}, contactNumber: {regex: RegExp, errorMessage: string}, emailAddress: {regex: RegExp, errorMessage: string}}}
     */

    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/,   //Allows for only letters , and spaces
            errorMessage: "Full name must contain only letters and spaces"
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact number must be in format "
        },
        emailAddress: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Invalid email address"
        }

    }

    function AddContact(fullName, contactNumber, emailAddress) {
        console.log("[DEBUG] AddContact() triggered...");

        if (!validateForm()) {
            alert("Form contains errors. Please correct them before submitting");
            return;
        }


        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, contact.serialize());
            console.log(`[INFO] Contact added: ${key}`);
        } else {
            console.error("[ERROR] Contact serialization failed");
        }

        //redirection
        router.navigate("/contacts-list");
    }

    function DisplayEditPage() {
        console.log("Called DisplayEditPage() ...");

        const page = location.hash.split("#")[2];
        const editButton = document.getElementById("editButton");

        switch (page) {
            case "add": {
                document.title = "Add Contact";
                document.querySelector("main > h1").textContent = "Add Contact";

                if (editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add Contact`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");
                }

                addEventListenersOnce("editButton", "click", handleAddClick);
                addEventListenersOnce("cancelButton", "click", handleCancelClick);


                break;
            }
            default: {
                // edit an existing contact
                const contact = new core.Contact();
                const contactData = localStorage.getItem(page);

                if (contactData) {
                    contact.deserialize(contactData);
                }

                //Prepopulate the form with current values
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;


                if (editButton) {
                    editButton.innerHTML = `<i class="fas fa-edit fa-lg"></i> Edit Contact`;
                    editButton.classList.remove("btn-success");
                    editButton.classList.add("btn-primary");
                }

                addEventListenersOnce("editButton", "click",
                    (event) => handleEditClick(event, contact, page));
                addEventListenersOnce("cancelButton", "click", handleCancelClick);
                break;
            }

        }

    }

    async function DisplayWeather() {
        const apiKey ="673b78b6a07d254b668705ff55798ec9";
        const city ="Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }

            const data = await response.json();
            console.log(data);

            const weatherDataElement = document.getElementById("weather-data");
            weatherDataElement.innerHTML = `<strong>City:</strong> ${data.name}<br>
                                            <strong>Tempreture:</strong> ${data.main.temp}°C <br>
                                            <strong>Weather: </strong> ${data.weather[0].description}<br>`;

        } catch (error) {
            console.error("Error calling openweathermap for Weather");
            document.getElementById("weather-data").textContent = "Unable to fetch weather data at this time";
        }

    }

    function DisplayHomePage() {
        console.log("Calling DisplayHomePage");

        const main = document.querySelector("main");
        main.innerHTML = "";

        main.insertAdjacentHTML(
            "beforeend",
            `<h1 class="mb-5"> Welcome to our site</h1>
            <button id="aboutUsButton" class="btn btn-primary">About Us </button>
            
            <div id="weather" class="mb-5">
                <h3>Weather Information</h3>
                <p id="weather-data"> Fetching weather data...</p>
            </div>
            
            <p id="MainParagraph" class="mt-5"> This is main paragraph</p>
            <article>
                <p id="ArticleParagraph" class="mt-3"> This is my article paragraph</p>
            </article>
            `
        );


        const aboutUsButton = document.getElementById("aboutUsButton");
        aboutUsButton.addEventListener("click", () => {
            location.href = "about.html";
            router.navigate("/about");
        });

        DisplayWeather();


    }

    function DisplayProductsPage() {
        console.log("Calling DisplayProductPage")
    }

    function DisplayServicesPage() {
        console.log("Calling DisplayServicesPage")
    }

    function DisplayAboutPage() {
        console.log("Calling DisplayAboutPage")
    }

    function DisplayContactsPage() {
        console.log("Calling DisplayContactPage")

        let sendButton = document.getElementById("sendButton");
        let subscriptionCheckBox = document.getElementById("subscriptionCheckbox");

        sendButton.addEventListener("click", function () {

            if (subscriptionCheckBox.checked) {
                AddContact(
                    document.getElementById("fullName").value,
                    document.getElementById("contactNumber").value,
                    document.getElementById("emailAddress").value
                );
            }
            alert("Form Successfully Submitted!");
        });

        const contactListButton = document.getElementById("showContactList");
        if (contactListButton) {
            contactListButton.addEventListener("click", function (event) {
                event.preventDefault();
                router.navigate("/contacts-list");
            });
        }
    }

    function DisplayContactsListPage() {
        console.log("Calling DisplayContactListPage");

        if (localStorage.length > 0) {

            let contactList = document.getElementById("contactList");
            let data = "";

            let keys = Object.keys(localStorage);
            //console.log(keys);

            let index = 1;
            for (const key of keys) {

                if (key.startsWith("contact_")) {
                    let contactData = localStorage.getItem(key);

                    try {
                        //console.log(contactData);
                        let contact = new core.Contact();
                        console.log(contactData);
                        contact.deserialize(contactData); // re-construct contact Object
                        data += `<tr> 
                                     <th scope="row" class="text-center">${index}</th>
                                     <td>${contact.fullName}</td>
                                     <td>${contact.contactNumber}</td>
                                     <td>${contact.emailAddress}</td>
                                     <td class="text-center">
                                        <button value="${key}" class="btn btn-warning btn-sm edit">
                                            <i class="fa-solid fa-pen-to-square"></i>Edit
                                        </button>
                                     </td> 
                                     <td class="text-center">
                                        <button value="${key}" class="btn btn-danger btn-sm delete">
                                            <i class="fa-solid fa-trash"></i>Delete
                                        </button>
                                     </td>
                                 </tr>`;
                        index++;


                    } catch (error) {
                        console.error("Error deserializing contact data", contactData, error.message);
                    }
                } else {
                    console.warn(`Skipping non-contact key: ${key}`);
                }
            }
            contactList.innerHTML = data;
        }

        const addButton = document.getElementById("addButton");
        addButton.addEventListener("click", () => {
            router.navigate("/edit#add")
        });

        const deleteButtons = document.querySelectorAll("button.delete");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", function () {

                const contactKey = this.value;
                console.log(`[DEBUG] Deleting contact With Contact ID: ${contactKey}`);

                if(!contactKey.startsWith("contact_")) {
                    console.error("[ERROR] Invalid contact key format");
                    return;
                }

                if (confirm("Delete contact,please confirm")) {
                    localStorage.removeItem(this.value);
                    DisplayContactsListPage();
                }
            });
        });

        const editButtons = document.querySelectorAll("button.edit");
        editButtons.forEach((button) => {
            button.addEventListener("click", function () {
                router.navigate(`/edit#${this.value}`);
            });
        });

    }

    //Listen for route changes , update nav links and call the respective Display*() function
    document.addEventListener("routeLoaded", (event) => {
        const  newPath = event.detail;
        console.log(`[INFO] New Route Loaded: ${newPath}`);

        LoadHeader().then( () => {
            handlePageLogic(newPath);
        });
    });

    window.addEventListener("sessionExpired", () => {
        console.warn("[SESSION] Redirecting the user due to inactivity");
        router.navigate("/login");
    });

    function handlePageLogic(path) {

        document.title = pageTitles[path] || "Untitled Page";

        const protectedRoutes = ["/contacts-list", "/edit"];
        if (protectedRoutes.includes(path)) {
            AuthGuard(); //redirected to /login if not authenticated
        }

        switch (path) {
            case"/":
            case"/home":
                DisplayHomePage();
                break;
            case "/about":
                DisplayAboutPage();
                break;
            case "/products":
                DisplayProductsPage();
                break;
            case "/services":
                DisplayServicesPage();
                break;
            case "/contacts":
                DisplayContactsPage();
                attachValidationListeners();
                break;
            case "/contacts-list":
                DisplayContactsListPage();
                break;
            case "/edit":
                DisplayEditPage();
                attachValidationListeners();
                break;
            case "/login":
                DisplayLoginPage();
                break;
            case "/register":
                DisplayRegisterPage();
                break;
            default:
                console.warn(`[WARNING] No display logic for route ${path}`);
        }

    }

    async function Start() {
            console.log("Starting App..");

        //Load header first then run checkLogin
            await LoadHeader();
            await LoadFooter();
            AuthGuard();


       const currentPath = location.hash.slice(1) || "/";
       router.loadRoute(currentPath);

       handlePageLogic(currentPath);

    }

    window.addEventListener("DOMContentLoaded", () => {
        console.log("Dom Fully loaded and parsed");
        Start();
    })
})();