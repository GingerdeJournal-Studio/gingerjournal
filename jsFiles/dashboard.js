/* -----------------------------------------
   IMPORTS
------------------------------------------*/
import { auth, db } from "../firebase-init.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { loadComponent } from "../include.js";
import {
    initHeaderMenu,
    initHeaderScrollBehavior,
    initScrollPopup
} from "../GlobalFiles/HEADER_FOOTER.js";

/* -----------------------------------------
   LOAD HEADER
------------------------------------------*/
loadComponent("#header", "GlobalFiles/HEADER.html", () => {
    initHeaderMenu();
    initHeaderScrollBehavior();
    initScrollPopup();
    import("../auth-state.js");
});
loadComponent("#footer", "GlobalFiles/FOOTER.html");

/* -----------------------------------------
   DOM ELEMENTS
------------------------------------------*/
const urlInput = document.getElementById("photoURL");
const titleInput = document.getElementById("photoTitle");
const descInput = document.getElementById("photoDesc");
const categorySelect = document.getElementById("photoCategory");
const tagsInput = document.getElementById("photoTags");
const submitBtn = document.getElementById("submitBtn");
const statusMsg = document.getElementById("statusMsg");

/* -----------------------------------------
   REQUIRE ADMIN
------------------------------------------*/
function requireAdmin() {
    const user = auth.currentUser;
    if (!user || user.email !== "gingerdejournal@gmail.com") {
        alert("You must be logged in as admin to use the dashboard.");
        throw new Error("Not admin");
    }
}

/* -----------------------------------------
   ADD PHOTO (URL-BASED)
------------------------------------------*/
submitBtn.addEventListener("click", async () => {
    try {
        requireAdmin();
    } catch {
        return;
    }

    const url = urlInput.value.trim();
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const category = categorySelect.value;
    const tags = tagsInput.value
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

    if (!url) {
        alert("Please fill in URL, title, and description.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Adding...";

    try {
        await addDoc(collection(db, "photos"), {
            url,
            title,
            description,
            category,
            tags,
            createdAt: serverTimestamp()
        });

        statusMsg.textContent = "Photo added successfully!";
        statusMsg.style.color = "green";

        // Clear form
        urlInput.value = "";
        titleInput.value = "";
        descInput.value = "";
        tagsInput.value = "";
        categorySelect.value = "Travel";

    } catch (err) {
        console.error("Error adding photo:", err);
        statusMsg.textContent = "Failed to add photo.";
        statusMsg.style.color = "red";
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Add Photo";
});

/* -----------------------------------------
   ADD BLOG POST
------------------------------------------*/
const titleInputP = document.getElementById("postTitle");
const dateInput = document.getElementById("postDate");
const locationInput = document.getElementById("postLocation");
const categoryInput = document.getElementById("postCategory");
const imageInput = document.getElementById("postImage");
const excerptInput = document.getElementById("postExcerpt");
const contentInput = document.getElementById("postContent");

const saveBtn = document.getElementById("savePostBtn");
const statusMessage = document.getElementById("statusMessage");

// Create slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

saveBtn.addEventListener("click", async () => {
    const title = titleInputP.value.trim();
    const date = dateInput.value.trim();
    const location = locationInput.value.trim();
    const category = categoryInput.value.trim();
    const image = imageInput.value.trim();
    const excerpt = excerptInput.value.trim();
    const content = contentInput.value.trim();

    if (!title) {
        statusMessage.style.color = "red";
        return;
    }

    const slug = createSlug(title);

    try {
        await addDoc(collection(db, "blogPosts"), {
            title,
            slug,
            date,
            location,
            category,
            image,
            excerpt,
            content,
            createdAt: serverTimestamp()
        });

        statusMessage.textContent = "Post published successfully!";
        statusMessage.style.color = "green";

        // Clear form
        titleInputP.value = "";
        dateInput.value = "";
        locationInput.value = "";
        categoryInput.value = "";
        imageInput.value = "";
        excerptInput.value = "";
        contentInput.value = "";

    } catch (error) {
        statusMessage.textContent = "Error publishing post.";
        statusMessage.style.color = "red";
        console.error(error);
    }
});
