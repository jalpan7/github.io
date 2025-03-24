// Author Name: Nirmal Patel, Jalpan Patel
// Group 9
// Date: 21/2/25
// Description: This is the TypeScript file for the website's router.

class Router {
    private routes: Record<string, string>;

    constructor(routes: Record<string, string>) {
        this.routes = routes;
        this.init();
    }

    private init(): void {
        window.addEventListener("hashchange", () => this.loadRoute());
        this.loadRoute();
    }

    private loadRoute(): void {
        const path: string = location.hash.slice(1) || "about"; // Default to about.html
        const route: string | undefined = this.routes[path];

        const appElement: HTMLElement | null = document.getElementById("app");

        if (!appElement) {
            console.error("Error: Element with ID 'app' not found.");
            return;
        }

        if (route) {
            fetch(route)
                .then(response => response.text())
                .then(html => {
                    appElement.innerHTML = html;
                })
                .catch(error => console.error("Error loading route:", error));
        } else {
            appElement.innerHTML = "<h2>Page Not Found</h2>";
        }
    }
}

// Define routes based on your folder structure
const routes: Record<string, string> = {
    "about": "views/content/about.html",
    "contactus": "views/content/contactus.html",
    "donate": "views/content/donate.html",
    "events": "views/content/events.html",
    "gallery": "views/content/gallary.html",
    "login": "views/content/login.html",
    "news": "views/content/news.html",
    "opportunities": "views/content/opportunities.html",
    "privacypolicy": "views/content/privacypolicy.html",
    "register": "views/content/register.html",
    "terms": "views/content/terms.html"
};

// Initialize the router
document.addEventListener("DOMContentLoaded", () => {
    new Router(routes);
});
