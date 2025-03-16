"use strict";

import {LoadHeader} from "./header.js";

export class Router {

    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init(){

        window.addEventListener("DOMContentLoaded", ()=>{
           const path = location.hash.slice(1) || "/"
            console.log(`[INFO] Initial page Load: ${path}`);
           this.loadRoute(path);
        });

        window.addEventListener("popstate", ()=>{
            console.log(`[INFO] navigating to: ${location.href.slice(1)} `);
            this.loadRoute(location.hash.slice(1))
        });

    }
    navigate(path){
       location.hash = path;

    }

    loadRoute(path){
        console.log(`[INFO] Loading route: ${path}`);

        //basePath="/edit#contact_12344"
        const basePath = path.split("#")[0];
        if(!this.routes[basePath]){
            console.log(`[WARNING] route not found ${basePath}, redirecting to 404`);
            location.hash = "/404"
            path = "/404";
        }

        fetch(this.routes[basePath])
            .then(response =>  {
            if (!response.ok) throw new Error (`Filed to load ${this.routes(basePath)}`);
            return response.text();
            })
            .then(html =>{
                document.querySelector("main").innerHTML = html;
                LoadHeader().then( () => {
                    //display a custom event to notify a new route has successfully loaded
                    document.dispatchEvent(new CustomEvent("routeLoaded", {detail: basePath}));
                });
            })
            .catch(error => {
                console.error("[ERROR] Error loading page:", error);
            });

    }

}