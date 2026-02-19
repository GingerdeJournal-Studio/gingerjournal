/* -----------------------------------------
   IMPORTS
------------------------------------------*/
import { auth, db } from "../firebase-init.js";

import {
    collection,
    getDocs,
    orderBy,
    query,
    limit,
    startAfter,
    deleteDoc,
    doc,
    updateDoc,
    where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { loadComponent } from "../include.js";
import {
    initHeaderMenu,
    initHeaderScrollBehavior,
    initScrollPopup,
    headerBehaviorChange,
} from "../GlobalFiles/HEADER_FOOTER.js";

/* -----------------------------------------
   LOAD HEADER/FOOTER
------------------------------------------*/
loadComponent("#header", "GlobalFiles/HEADER.html", () => {
    initHeaderMenu();
    initHeaderScrollBehavior();
    initScrollPopup();
    headerBehaviorChange();
    import("../auth-state.js");
});
loadComponent("#footer", "GlobalFiles/FOOTER.html");

/* -----------------------------------------
   CATEGORY FILTER STATE
------------------------------------------*/
let currentCategory = "All";

/* -----------------------------------------
   PAGINATION STATE
------------------------------------------*/
let lastVisible = null;
const PAGE_SIZE = 20;
let loading = false;

/* -----------------------------------------
   LOAD PHOTOS (WITH CATEGORY + PAGINATION)
------------------------------------------*/
async function loadPhotos(initial = false) {
    if (loading) return;
    loading = true;

    const container = document.getElementById("photoContainer");

    if (initial) {
        container.innerHTML = "";
        lastVisible = null;
    }

    try {
        let q;

        if (currentCategory === "All") {
            q = query(
                collection(db, "photos"),
                orderBy("createdAt", "desc"),
                ...(lastVisible ? [startAfter(lastVisible)] : []),
                limit(PAGE_SIZE)
            );
        } else {
            q = query(
                collection(db, "photos"),
                where("category", "==", currentCategory),
                orderBy("createdAt", "desc"),
                ...(lastVisible ? [startAfter(lastVisible)] : []),
                limit(PAGE_SIZE)
            );
        }

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            document.getElementById("loadMoreBtn").style.display = "none";
            loading = false;
            return;
        }

        lastVisible = snapshot.docs[snapshot.docs.length - 1];

        const user = auth.currentUser;
        const isAdmin = user && user.email === "gingerdejournal@gmail.com";

        snapshot.forEach(docSnap => {
            const photo = docSnap.data();
            const id = docSnap.id;

            const downloadURL =
                `https://square-cherry-712b.gingerdejournal.workers.dev/?file=${encodeURIComponent(photo.url)}`;

            const card = document.createElement("div");
            card.className = "photoCard";

            const tagHTML = photo.tags && photo.tags.length
                ? `<div class="tagRow">${photo.tags.join(" • ")}</div>`
                : "";

            card.innerHTML = `
                <div class="photoImg"
                     style="background-image: url('${photo.url}')"
                     data-full="${photo.url}"
                     data-download="${downloadURL}">
                </div>

                <h3>${photo.title}</h3>
                <p>${photo.description}</p>

                <div class="tag">${tagHTML}</div>

                <!--
                <button class="downloadBtn"
                        data-url="${downloadURL}">
                    Download
                </button>
                -->

                ${isAdmin ? `
                <div class="adminControls">
                    <button class="editBtn" data-id="${id}">Edit</button>
                    <button class="deleteBtn" data-id="${id}">Delete</button>
                </div>` : ""}
            `;

            requestAnimationFrame(() => {
                card.classList.add("visible");
            });

            container.appendChild(card);
        });

        if (snapshot.size < PAGE_SIZE - 1) {
            document.getElementById("loadMoreBtn").style.display = "none";
        } else {
            document.getElementById("loadMoreBtn").style.display = "block";
        }


    } catch (err) {
        console.error("Error loading photos:", err);
    }

    loading = false;
}

loadPhotos(true);

/* -----------------------------------------
   CATEGORY BUTTON LOGIC
------------------------------------------*/
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("categoryBtn")) return;

    document.querySelectorAll(".categoryBtn").forEach(btn =>
        btn.classList.remove("active")
    );

    e.target.classList.add("active");

    currentCategory = e.target.dataset.category;

    // Auto-scroll to top of gallery
    window.scrollTo({
        top: document.getElementById("categoryFilters").offsetTop,
        behavior: "smooth"
    });

    loadPhotos(true);
});


/* -----------------------------------------
   LOAD MORE BUTTON
------------------------------------------*/
document.getElementById("loadMoreBtn").addEventListener("click", () => {
    loadPhotos(false);
});

/* -----------------------------------------
   LIGHTBOX LOGIC
------------------------------------------*/
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxDownload = document.getElementById("lightbox-download");

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("photoImg")) {
        const full = e.target.dataset.full;
        const download = e.target.dataset.download;

        lightboxImg.src = full;
        lightboxDownload.dataset.url = download;

        lightbox.classList.remove("hidden");
    }

    if (e.target === lightboxClose || e.target === lightbox) {
        lightbox.classList.add("hidden");
    }

    if (e.target === lightboxDownload) {
        const url = e.target.dataset.url;

        const a = document.createElement("a");
        a.href = url;
        a.download = url.split("/").pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
});

/* -----------------------------------------
   DOWNLOAD BUTTONS
------------------------------------------*/
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("downloadBtn")) return;

    const url = e.target.dataset.url;

    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
});

/* -----------------------------------------
   DELETE PHOTO (ADMIN ONLY)
------------------------------------------*/
document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("deleteBtn")) return;

    const id = e.target.dataset.id;

    if (!confirm("Delete this photo?")) return;

    try {
        await deleteDoc(doc(db, "photos", id));
        e.target.closest(".photoCard").remove();
    } catch (err) {
        console.error("Error deleting photo:", err);
        alert("Failed to delete photo.");
    }
});

/* -----------------------------------------
   EDIT PHOTO (ADMIN ONLY)
------------------------------------------*/
document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("editBtn")) return;

    const id = e.target.dataset.id;

    const card = e.target.closest(".photoCard");
    const titleEl = card.querySelector("h3");
    const descEl = card.querySelector("p");

    const newTitle = prompt("New title:", titleEl.textContent);
    if (newTitle === null) return;

    const newDesc = prompt("New description:", descEl.textContent);
    if (newDesc === null) return;

    try {
        await updateDoc(doc(db, "photos", id), {
            title: newTitle,
            description: newDesc
        });

        titleEl.textContent = newTitle;
        descEl.textContent = newDesc;

    } catch (err) {
        console.error("Error updating photo:", err);
        alert("Failed to update photo.");
    }
});

async function loadRandomHero() {
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
}

loadRandomHero();



