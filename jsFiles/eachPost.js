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

import { db } from "../firebase-init.js";
import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// DOM elements
const postImage = document.getElementById("postImage");
const postTitle = document.getElementById("postTitle");
const postDate = document.getElementById("postDate");
const postLocation = document.getElementById("postLocation");
const postCategory = document.getElementById("postCategory");
const postExcerpt = document.getElementById("postExcerpt");
const postContent = document.getElementById("postContent");

async function loadPost() {
    if (!slug) {
        postTitle.textContent = "Post not found.";
        return;
    }

    // ⭐ Query by slug instead of doc ID
    const q = query(
        collection(db, "blogPosts"),
        where("slug", "==", slug)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
        postTitle.textContent = "Post not found.";
        return;
    }

    const data = snap.docs[0].data();

    postImage.src = data.image;
    postTitle.textContent = data.title;
    postDate.textContent = data.date;
    postLocation.textContent = data.location;
    postCategory.textContent = data.category;
    postExcerpt.textContent = data.excerpt;
    postContent.innerHTML = data.content.replace(/\n/g, "<br>");
}

loadPost();
