/* -----------------------------
   LOAD HEADER + FOOTER
------------------------------*/
import { loadComponent } from "../include.js";
import {
    initHeaderMenu,
    initHeaderScrollBehavior,
    initScrollPopup
} from "../GlobalFiles/HEADER_FOOTER.js";

loadComponent("#header", "GlobalFiles/GlobalFiles.html", () => {
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
