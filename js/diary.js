import { db } from "./firebase-config.js";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Lấy tất cả nhật ký của user
export async function getDiaries(userId) {
    const q = query(collection(db, "diaries"), where("userId", "==", userId), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Thêm mới
export async function addDiary(userId, date, emotion, content) {
    return await addDoc(collection(db, "diaries"), {
        userId,
        date,
        emotion,
        content,
        createdAt: new Date()
    });
}

// Cập nhật
export async function updateDiary(diaryId, emotion, content) {
    await updateDoc(doc(db, "diaries", diaryId), { emotion, content });
}

// Xóa
export async function deleteDiary(diaryId) {
    await deleteDoc(doc(db, "diaries", diaryId));
}