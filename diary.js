import { db } from "./firebase-config.js";
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, getDocs, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Realtime listener — trả về hàm unsubscribe
export function listenDiaries(userId, callback) {
    const q = query(
        collection(db, "diaries"),
        where("userId", "==", userId),
        orderBy("date", "desc")
    );
    return onSnapshot(q, (snapshot) => {
        const diaries = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(diaries);
    });
}

export async function addDiary(userId, date, emotion, content) {
    return await addDoc(collection(db, "diaries"), {
        userId, date, emotion, content, createdAt: new Date()
    });
}

export async function updateDiary(diaryId, emotion, content) {
    await updateDoc(doc(db, "diaries", diaryId), { emotion, content });
}

export async function deleteDiary(diaryId) {
    await deleteDoc(doc(db, "diaries", diaryId));
}