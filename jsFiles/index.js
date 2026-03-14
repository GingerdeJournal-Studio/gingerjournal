/* -----------------------------
   LOAD HEADER + FOOTER
------------------------------*/
import { loadComponent } from "../include.js";
import {
    initHeaderMenu,
    initHeaderScrollBehavior,
    initScrollPopup
} from "../GlobalFiles/HEADER_FOOTER.js";

loadComponent("#header", "GlobalFiles/HEADER.html", () => {
    initHeaderMenu();
    initHeaderScrollBehavior();
    initScrollPopup();

    // Wait for #userArea to appear, then load auth-state.js
    const wait = setInterval(() => {
        const el = document.getElementById("userArea");
        if (el) {
            clearInterval(wait);
            import("../auth-state.js");
        }
    }, 30);
});
loadComponent("#footer", "GlobalFiles/FOOTER.html");

// use a script tag or an external JS file
document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger)

    let horizontalSection = document.querySelector(".horizontal");

    gsap.to(".horizontal", {
        x: ()=> -(horizontalSection.scrollWidth - window.innerWidth),
        scrollTrigger: {
            trigger: ".horizontal",
            start: "center center",
            end: () => "+=" + (horizontalSection.scrollWidth - 50),
            pin: "#horizontalScroll",
            scrub: 1,
            invalidateOnRefresh: true
        }
    })
});

