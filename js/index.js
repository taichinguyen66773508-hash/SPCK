import { requireAuth, getCurrentUser, logout } from "./auth.js";
import { listenDiaries, deleteDiary } from "./diary.js";
import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

requireAuth();
const userEmailSpan = document.getElementById("userEmail");
const entriesDiv = document.getElementById("entriesList");
const greetingEl = document.getElementById("greeting");
const diaryCountMsg = document.getElementById("diaryCountMsg");
const statsBadge = document.getElementById("statsBadge");

document.getElementById("logoutBtn").onclick = logout;

let allDiaries = [];
let currentFilter = "all";
let currentSearch = "";
let unsubscribeDiaries = null;

function getTimeFromDiary(diary) {
    if (diary.createdAt && diary.createdAt.toDate) {
        const date = diary.createdAt.toDate();
        return date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    }
    return "";
}

function updateWelcomeAndStats(diaries) {
    const user = auth.currentUser;
    if (!user) return;
    const hour = new Date().getHours();
    let greeting = hour < 12 ? "Chào buổi sáng" : (hour < 18 ? "Chào buổi chiều" : "Chào buổi tối");
    greetingEl.innerHTML = `${greeting}, ${user.email.split('@')[0]}! 🌟`;
    const count = diaries.length;
    diaryCountMsg.innerHTML = `Bạn đã có <strong>${count}</strong> dòng nhật ký.`;
    statsBadge.innerHTML = `📊 ${count} bài`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, (m) => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;'));
}

function renderDiaries(diaries) {
    if (diaries.length === 0 && allDiaries.length === 0) {
        entriesDiv.innerHTML = '<div class="empty-msg">📭 Chưa có nhật ký nào. <a href="add.html" style="color:#b45f2b;">Thêm ngay</a>!</div>';
        return;
    }
    if (diaries.length === 0) {
        entriesDiv.innerHTML = '<div class="empty-msg">😔 Không tìm thấy nhật ký phù hợp.</div>';
        return;
    }
    let html = "";
    for (const d of diaries) {
        let emotionDisplay = "", emotionIcon = "";
        switch(d.emotion) {
            case 'vui': emotionDisplay = 'Vui vẻ'; emotionIcon = '😊'; break;
            case 'buồn': emotionDisplay = 'Buồn'; emotionIcon = '😢'; break;
            case 'bình thường': emotionDisplay = 'Bình thường'; emotionIcon = '😐'; break;
            case 'yêu': emotionDisplay = 'Yêu thương'; emotionIcon = '❤️'; break;
            case 'phấn khích': emotionDisplay = 'Phấn khích'; emotionIcon = '🤩'; break;
            case 'tức giận': emotionDisplay = 'Tức giận'; emotionIcon = '😠'; break;
            default: emotionDisplay = d.emotion; emotionIcon = '📝';
        }
        const timeStr = getTimeFromDiary(d);
        html += `
            <div class="entry-card">
                <div class="entry-header">
                    <span><span class="entry-emotion-icon">${emotionIcon}</span> 📅 ${d.date} ${timeStr ? `⏰ ${timeStr}` : ''}</span>
                    <span class="entry-emotion">${emotionIcon} ${emotionDisplay}</span>
                </div>
                <div class="entry-content">${escapeHtml(d.content).replace(/\n/g, '<br>')}</div>
                <div class="entry-actions">
                    <a href="edit.html?id=${d.id}" class="edit-btn">✏️ Sửa</a>
                    <button class="delete-btn" data-id="${d.id}">🗑️ Xóa</button>
                </div>
            </div>
        `;
    }
    entriesDiv.innerHTML = html;
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('Xóa nhật ký này?')) {
                await deleteDiary(btn.dataset.id);
                // Không cần gọi lại loadDiaries, onSnapshot tự cập nhật!
            }
        });
    });
}

function filterAndSearch() {
    let filtered = [...allDiaries];
    if (currentFilter !== "all") filtered = filtered.filter(d => d.emotion === currentFilter);
    if (currentSearch.trim() !== "") {
        const kw = currentSearch.trim().toLowerCase();
        filtered = filtered.filter(d => d.content.toLowerCase().includes(kw));
    }
    renderDiaries(filtered);
    updateWelcomeAndStats(allDiaries);
}

function initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.emotion;
            filterAndSearch();
        });
    });
    document.getElementById('searchBtn').addEventListener('click', () => {
        currentSearch = document.getElementById('searchInput').value;
        filterAndSearch();
    });
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            currentSearch = e.target.value;
            filterAndSearch();
        }
    });
}

initFilters();

onAuthStateChanged(auth, (user) => {
    if (user) {
        userEmailSpan.textContent = user.email;
        if (unsubscribeDiaries) unsubscribeDiaries();
        unsubscribeDiaries = listenDiaries(user.uid, (diaries) => {
            allDiaries = diaries;
            updateWelcomeAndStats(allDiaries);
            filterAndSearch();
        });
    } else {
        if (unsubscribeDiaries) unsubscribeDiaries();
    }
});