import {
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const storage = getStorage();

import { onAuthStateChanged, signOut }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth, db } from "../firebase-init.js";
import { loadComponent } from "../include.js";
import {
    initHeaderMenu,
    initHeaderScrollBehavior,
    initScrollPopup
} from "../GlobalFiles/HEADER_FOOTER.js";


/* -----------------------------
   LOAD HEADER
------------------------------*/
loadComponent("#header", "GlobalFiles/GlobalFiles.html", () => {
    initHeaderMenu();
    initHeaderScrollBehavior();
    initScrollPopup();
    import("../auth-state.js");
});

/* -----------------------------
   PROFILE LOGIC
------------------------------*/
const pic = document.getElementById("profilePic");
const nameEl = document.getElementById("profileName");
const emailEl = document.getElementById("profileEmail");
const logoutBtn = document.getElementById("logoutBtn");
const downloadsList = document.getElementById("downloadsList");

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // ADMIN DASHBOARD BUTTON
    const dashboardBtn = document.getElementById("dashboardBtn");

    if (user.email === "gingerdejournal@gmail.com") {
        dashboardBtn.style.display = "block";
        dashboardBtn.onclick = () => {
            window.location.href = "dashboard.html";
        };
    }

    // Change Display Name
    const saveNameBtn = document.getElementById("saveNameBtn");
    const newNameInput = document.getElementById("newName");

    saveNameBtn.onclick = async () => {
        const newName = newNameInput.value.trim();
        if (!newName) return alert("Please enter a name.");

        await updateProfile(user, { displayName: newName });

        nameEl.textContent = newName;
        alert("Name updated!");
    };

    pic.src = user.photoURL;
    nameEl.textContent = user.displayName;
    emailEl.textContent = user.email;

    logoutBtn.onclick = () => signOut(auth);
});
