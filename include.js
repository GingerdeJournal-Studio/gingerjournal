// Load an HTML component and run a callback AFTER it finishes loading
export async function loadComponent(selector, file, callback) {
    const container = document.querySelector(selector);
    if (!container) return;

    try {
        const response = await fetch(file);
        const html = await response.text();
        container.innerHTML = html;

        if (typeof callback === "function") {
            callback();
        }
    } catch (err) {
        console.error(`Error loading ${file}:`, err);
    }
}
