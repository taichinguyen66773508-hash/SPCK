import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function requireAuth() {
    onAuthStateChanged(auth, (user) => {
        if (!user) window.location.href = "login.html";
    });
}

export function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

export function logout() {
    signOut(auth);
    window.location.href = "login.html";
}

export async function login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
}

export async function register(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        email: user.email,
        createdAt: new Date(),
        uid: user.uid
    });
    return userCredential;
}