/* -----------------------------
   HEADER SCROLL BEHAVIOR
------------------------------*/
export function initHeaderScrollBehavior() {
    const headerEl = document.querySelector("#header header");
    if (!headerEl) return;

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight - 100;

        if (scrollY > heroHeight) {
            headerEl.classList.add("transparent");
        } else {
            headerEl.classList.remove("transparent");
        }
    });
}

export function headerBehaviorChange() {
    const headerEl = document.querySelector("#header header");
    if (!headerEl) return;

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;

        if (scrollY > 0) {
            headerEl.classList.add("transparent");
        } else {
            headerEl.classList.remove("transparent");
        }
    });
}

/* -----------------------------
   HAMBURGER MENU
------------------------------*/
export function initHeaderMenu() {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        mobileMenu.classList.toggle("open");
    });
}

/* -----------------------------
   POPUP

export function initScrollPopup() {
    const HOURS = 1;
    const COOLDOWN = HOURS * 60 * 60 * 1000;

    const lastShown = localStorage.getItem("popupLastShown");
    const now = Date.now();

    if (lastShown && (now - lastShown) < COOLDOWN) return;

    const popup = document.createElement("div");
    popup.id = "scrollPopup";
    popup.className = "scrollPopup";
    popup.innerHTML = `
        <h3>HEY!! WELCOME TO GINGERJOURNAL (this reminder shows up every hour :)</h3>
        <p>This is my first time making a website with a login feature so the button might play hide and seek with U!!</p>
        <p>I'm realllyyy sorry if that happens to u, and if it does please just refresh and it will show up trust!!</p>
    `;
    document.body.appendChild(popup);

    let popupShown = false;

    function showScrollPopup() {
        if (popupShown) return;
        popupShown = true;

        popup.classList.add("show");
        localStorage.setItem("popupLastShown", Date.now());

        setTimeout(() => popup.classList.remove("show"), 5000);
    }

    window.addEventListener("scroll", showScrollPopup, { once: true });
}

------------------------------*/