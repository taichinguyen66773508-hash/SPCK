import { login, register } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginMsg = document.getElementById("loginMsg");
const regMsg = document.getElementById("regMsg");

loginTab.onclick = () => {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
};
registerTab.onclick = () => {
    registerForm.style.display = "block";
    loginForm.style.display = "none";
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
};

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const pwd = document.getElementById("loginPassword").value;
    try {
        await login(email, pwd);
        window.location.href = "index.html";
    } catch (err) {
        loginMsg.innerText = "Sai email hoặc mật khẩu";
    }
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const pwd = document.getElementById("regPassword").value;
    if (pwd.length < 6) {
        regMsg.innerText = "Mật khẩu tối thiểu 6 ký tự";
        return;
    }
    try {
        await register(email, pwd);
        regMsg.innerText = "Đăng ký thành công!";
        setTimeout(() => { window.location.href = "index.html"; }, 1000);
    } catch (err) {
        if (err.code === "auth/email-already-in-use") regMsg.innerText = "Email đã tồn tại";
        else regMsg.innerText = "Lỗi: " + err.message;
    }
});

onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = "index.html";
});