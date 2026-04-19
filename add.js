import { requireAuth, getCurrentUser, logout } from "./auth.js";
import { addDiary } from "./diary.js";
requireAuth();
document.getElementById("logoutBtn").onclick = logout;

const dateInput = document.getElementById("dateInput");
const emotionSelect = document.getElementById("emotionSelect");
const contentInput = document.getElementById("contentInput");
const addMsg = document.getElementById("addMsg");

function getToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
dateInput.value = getToday();

document.getElementById("addForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = await getCurrentUser();
    if (!user) return;
    const content = contentInput.value.trim();
    if (!content) {
        addMsg.innerText = "Vui lòng nhập nội dung";
        return;
    }
    try {
        await addDiary(user.uid, dateInput.value, emotionSelect.value, content);
        addMsg.style.color = "green";
        addMsg.innerText = "✅ Đã lưu! Chuyển về trang chủ...";
        setTimeout(() => { window.location.href = "index.html"; }, 1200);
    } catch (err) {
        addMsg.innerText = "Lỗi: " + err.message;
    }
});