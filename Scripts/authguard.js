"use strict";

let sessionTimeout;

function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
       console.warn("[WARNING] Session expired due to inactivity");
       sessionStorage.removeItem("user");
        window.dispatchEvent(new CustomEvent("sessionExpired"));

    },15 * 60 * 1000) //Session timeout of 15 minutes
}

//Reset the session based on the user activity
document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("keypress", resetSessionTimeout);



export function AuthGuard(){

    const user = sessionStorage.getItem("user");
    const protectedRoutes = [`/contacts-list`, "/edit"];

    if(!user && protectedRoutes.includes(location.hash.slice(1))){
        console.warn("[AUTHGUARD] unauthorized access detected. Redirecting to login page");
        window.dispatchEvent(new CustomEvent("sessionExpired"));
    }else {
        resetSessionTimeout();
    }



}