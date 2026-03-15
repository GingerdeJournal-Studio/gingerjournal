import { auth } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const desktopArea = document.getElementById("userArea");
const mobileArea = document.getElementById("mobileUserArea");

function renderLoggedOut() {
    desktopArea.innerHTML = `<a href="login.html" class="loginBtn"><img src="https://pub-3a50bbfda00a49b2b959d58cd7bea019.r2.dev/Images/Logo/Icons/USER_ICON.svg"></a>`;
    mobileArea.innerHTML = `<a href="login.html" class="loginBtn">LOGIN HERE</a>`;
}

function renderLoggedIn(user) {
    desktopArea.innerHTML = `
    <div class="avatarWrapper">
        <img src="${user.photoURL}" class="avatar" id="logoutDesktop">
        <span class="tooltip">Settings</span>
    </div>
    `;

    mobileArea.innerHTML = `
    <div class="avatarWrapper">
        <div class="mobileWrapper" id="logoutMobile">
            <p>Settings</p>
        </div> 
    </div>
    `;

    document.getElementById("logoutDesktop").onclick = () => {
        window.location.href = "profile.html";
    };
    document.getElementById("logoutMobile").onclick = () => {
        window.location.href = "profile.html";
    };
}

onAuthStateChanged(auth, (user) => {
    if (user) renderLoggedIn(user);
    else renderLoggedOut();
});
