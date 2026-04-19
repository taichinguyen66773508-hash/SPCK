import { requireAuth, getCurrentUser, logout } from "./auth.js";
import { updateDiary } from "./diary.js";
import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

requireAuth();
document.getElementById("logoutBtn").onclick = logout;

const urlParams = new URLSearchParams(window.location.search);
const diaryId = urlParams.get("id");
if (!diaryId) {
    alert("Không tìm thấy nhật ký!");
    window.location.href = "index.html";
}

const editDate = document.getElementById("editDate");
const editEmotion = document.getElementById("editEmotion");
const editContent = document.getElementById("editContent");
const editMsg = document.getElementById("editMsg");

async function loadData() {
    const user = await getCurrentUser();
    if (!user) return;
    const docRef = doc(db, "diaries", diaryId);
    const snap = await getDoc(docRef);
    if (!snap.exists() || snap.data().userId !== user.uid) {
        alert("Bạn không có quyền sửa");
        window.location.href = "index.html";
        return;
    }
    const data = snap.data();
    editDate.value = data.date;
    editEmotion.value = data.emotion;
    editContent.value = data.content;
}
loadData();

document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newEmotion = editEmotion.value;
    const newContent = editContent.value.trim();
    if (!newContent) {
        editMsg.innerText = "Nội dung không được trống";
        return;
    }
    try {
        await updateDiary(diaryId, newEmotion, newContent);
        editMsg.style.color = "green";
        editMsg.innerText = "✅ Cập nhật thành công!";
        setTimeout(() => { window.location.href = "index.html"; }, 1000);
    } catch (err) {
        editMsg.innerText = "Lỗi: " + err.message;
    }
});