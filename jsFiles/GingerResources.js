
    /* -----------------------------
    LOAD HEADER + FOOTER
    ------------------------------*/
    loadComponent("#header", "GlobalFiles/GlobalFiles.html", () => {
        initHeaderMenu();
        initHeaderScrollBehavior();
        initScrollPopup();

        // ⭐ Add this back — it loads your login UI
        import("../auth-state.js");
    });

    import { loadComponent } from "../include.js";
    import { initHeaderMenu, initHeaderScrollBehavior, initScrollPopup }
    from "../GlobalFiles/HEADER_FOOTER.js";

    loadComponent("#header", "GlobalFiles/GlobalFiles.html", () => {
    initHeaderMenu();
    initHeaderScrollBehavior();
    initScrollPopup();
    });

    /* -----------------------------
    LOAD PHOTO DATA
    ------------------------------*/
    fetch("GlobalFiles/photoData.json")
    .then(res => res.json())
    .then(data => {
    const container = document.getElementById("photoContainer");

    data.forEach(photo => {
    const card = document.createElement("div");
    card.className = "photoCard";

    card.innerHTML = `
                <div class="photoImg"
                     style="background-image: url('${photo.full}')"
                     data-full="${photo.full}"
                     data-download="${photo.download}">
                </div>

                <h3>${photo.title}</h3>
                <p>${photo.description}</p>

                <button class="downloadBtn"
                        data-url="${photo.download}">
                    Download
                </button>
            `;

    container.appendChild(card);
});
});

    /* -----------------------------
    LIGHTBOX LOGIC
    ------------------------------*/
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");
    const lightboxDownload = document.getElementById("lightbox-download");

    document.addEventListener("click", (e) => {

    // Open lightbox
    if (e.target.classList.contains("photoImg")) {
    const full = e.target.dataset.full;
    const download = e.target.dataset.download;

    lightboxImg.src = full;
    lightboxDownload.dataset.url = download;

    lightbox.classList.remove("hidden");
}

    // Close lightbox
    if (e.target === lightboxClose || e.target === lightbox) {
    lightbox.classList.add("hidden");
}

    // Download inside lightbox
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

    /* -----------------------------
    DOWNLOAD BUTTONS (outside lightbox)
    ------------------------------*/
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