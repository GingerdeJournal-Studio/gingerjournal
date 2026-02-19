import { db } from "../firebase-init.js";
import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const blogGrid = document.getElementById("blogGrid");
const filterButtons = document.querySelectorAll(".filter");

// Load posts from Firestore
async function loadPosts() {
    const q = query(
        collection(db, "blogPosts"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// Render posts
async function renderPosts(category = "All") {
    blogGrid.innerHTML = "";

    const posts = await loadPosts();

    const filtered = category === "All"
        ? posts
        : posts.filter(p => p.category === category);

    filtered.forEach(post => {
        const card = document.createElement("div");
        card.className = "blog-card";

        card.innerHTML = `
            <a href="eachPost.html?slug=${post.slug}" class="blog-link">
                <img src="${post.image}" alt="${post.title}">
                <div class="content">
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="date">${post.date}</div>
                </div>
            </a>
        `;

        blogGrid.appendChild(card);
    });
}

// Filter logic
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter.active").classList.remove("active");
        btn.classList.add("active");
        renderPosts(btn.dataset.category);
    });
});

// Initial load
renderPosts();

// RANDOM HERO PHOTO
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


