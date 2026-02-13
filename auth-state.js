import { auth } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const desktopArea = document.getElementById("userArea");
const mobileArea = document.getElementById("mobileUserArea");

function renderLoggedOut() {
    desktopArea.innerHTML = `<a href="login.html" class="loginBtn">LOGIN</a>`;
    mobileArea.innerHTML = `<a href="login.html" class="loginBtn">LOGIN HERE</a>`;
}

function renderLoggedIn(user) {
    desktopArea.innerHTML = `
    <div class="avatarWrapper">
        <img src="${user.photoURL}" class="avatar" id="logoutDesktop">
        <span class="tooltip">Click To Logout</span>
    </div>
    `;

    mobileArea.innerHTML = `
    <div class="avatarWrapper">
        <div class="mobileWrapper" id="logoutMobile">
            <p>LOGOUT</p>
        </div> 
    </div>
    `;


    document.getElementById("logoutDesktop").onclick = () => signOut(auth);
    document.getElementById("logoutMobile").onclick = () => signOut(auth);
}

onAuthStateChanged(auth, (user) => {
    if (user) renderLoggedIn(user);
    else renderLoggedOut();
});
