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
    headerBehaviorChange,
    initScrollPopup
} from "../GlobalFiles/HEADER_FOOTER.js";


/* -----------------------------
   LOAD HEADER
------------------------------*/
loadComponent("#header", "GlobalFiles/HEADER.html", () => {
    initHeaderMenu();
    headerBehaviorChange();
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
        window.location.href = "index.html";
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

// Load random photo
const hero = document.getElementById("heroImage");

const res = await fetch("https://royal-flower-d95a.gingerdejournal.workers.dev/");
const images = await res.json();

const random = images[Math.floor(Math.random() * images.length)];

console.log("Hero element:", hero);
console.log("Images:", images);
console.log("Random:", random);

hero.style.backgroundImage = `url('${random}')`;

requestAnimationFrame(() => {
    hero.classList.add("visible");
});