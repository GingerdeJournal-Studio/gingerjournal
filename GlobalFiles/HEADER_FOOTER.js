    async function loadComponent(id, file) {
        const container = document.getElementById(id);
        const response = await fetch(file);
        const html = await response.text();
        container.innerHTML = html;

        initHeaderMenu();
        initHeaderScrollBehavior()
    }

    function initHeaderScrollBehavior() {
        const headerEl = document.querySelector("#header header");

        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY;
            const heroHeight = window.innerHeight - 100; // 100vh - 100 (menu height)

            if (scrollY > heroHeight) {
                headerEl.classList.add("transparent");
            } else {
                headerEl.classList.remove("transparent");
            }
        });
    }

    function initHeaderMenu() {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("open");
});
}
loadComponent("header", "GlobalFiles/GlobalFiles.html");
