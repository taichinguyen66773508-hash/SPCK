import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Kiểm tra đăng nhập, nếu chưa thì chuyển về login
export function requireAuth() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "login.html";
        }
    });
}

// Lấy user hiện tại (Promise)
export function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

// Đăng xuất
export function logout() {
    signOut(auth);
    window.location.href = "login.html";
}

// Đăng nhập
export async function login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
}

// Đăng ký
export async function register(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password);
}