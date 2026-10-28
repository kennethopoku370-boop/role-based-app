// Sample initial student data
let defaultStudents = [
    { id: "01255249D", name: "Kenneth Opoku", dept: "Computer Science", status: "Present", timestamp: "2026-10-28 08:30" },
    { id: "01255250D", name: "Samuel Otoo", dept: "Computer Science", status: "Not Marked", timestamp: "-" }
];

// Load from LocalStorage or initialize
let students = JSON.parse(localStorage.getItem("attendly_students")) || defaultStudents;
let currentUser = JSON.parse(localStorage.getItem("loggedUser")) || { role: "admin", name: "User" };

document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
});

function initDashboard() {
    // 1. Role Check Header Customization
    const welcomeTitle = document.getElementById("welcomeTitle");
    const adminControls = document.getElementById("adminControls");

    if (currentUser.role === "student") {
        welcomeTitle.innerText = `Dashboard - Welcome ${currentUser.name} 📚`;
        if (adminControls) adminControls.style.display = "none";
    } else if (currentUser.role === "coordinator") {
        welcomeTitle.innerText = "Dashboard - Coordinator View 📚";
    } else {
        welcomeTitle.innerText = "Dashboard - All Registered Students Loop 📚";
    }

    renderTable();
    updateStats();
    setupEventListeners();
}

// Render Attendance Table
function renderTable() {
    const tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No students registered yet.</td></tr>`;
        return;
    }

    students.forEach((student, index) => {
        let badgeClass = "badge-unmarked";
        if (student.status === "Present") badgeClass = "badge-present";
        if (student.status === "Absent") badgeClass = "badge-absent";

        let actionButtons = "";
        if (currentUser.role === "admin" || currentUser.role === "coordinator") {
            actionButtons = `
                <button class="btn btn-primary btn-sm" onclick="markAttendance(${index}, 'Present')">P</button>
                <button class="btn btn-danger btn-sm" onclick="markAttendance(${index}, 'Absent')">A</button>
            `;
        } else {
            actionButtons = `<span style="color:#888;">View Only</span>`;
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.dept}</td>
            <td><span class="badge ${badgeClass}">${student.status}</span></td>
            <td>${student.timestamp}</td>
            <td>${actionButtons}</td>
        `;
        tbody.appendChild(row);
    });
}

// Update Stat Counter Cards
function updateStats() {
    const total = students.length;
    const present = students.filter(s => s.status === "Present").length;
    const absent = students.filter(s => s.status === "Absent").length;
    const notMarked = students.filter(s => s.status === "Not Marked").length;

    document.getElementById("totalCount").innerText = total;
    document.getElementById("presentCount").innerText = present;
    document.getElementById("absentCount").innerText = absent;
    document.getElementById("notMarkedCount").innerText = notMarked;
}

// Mark Attendance Function
function markAttendance(index, status) {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    students[index].status = status;
    students[index].timestamp = formattedDate;
    
    saveAndRefresh();
}

// Save to LocalStorage and refresh UI
function saveAndRefresh() {
    localStorage.setItem("attendly_students", JSON.stringify(students));
    renderTable();
    updateStats();
}

// Setup Modal & Button Event Listeners
function setupEventListeners() {
    const modal = document.getElementById("studentModal");
    const openBtn = document.getElementById("openModalBtn");
    const closeBtn = document.getElementById("closeModalBtn");
    const addForm = document.getElementById("addStudentForm");
    const clearBtn = document.getElementById("clearAllBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (openBtn) openBtn.onclick = () => modal.style.display = "flex";
    if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
    
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (confirm("Are you sure you want to clear all students?")) {
                students = [];
                saveAndRefresh();
            }
        };
    }

    if (addForm) {
        addForm.onsubmit = (e) => {
            e.preventDefault();
            const id = document.getElementById("studentId").value;
            const name = document.getElementById("studentName").value;
            const dept = document.getElementById("studentDept").value;

            students.push({ id, name, dept, status: "Not Marked", timestamp: "-" });
            saveAndRefresh();

            addForm.reset();
            modal.style.display = "none";
        };
    }

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem("loggedUser");
            window.location.href = "index.html";
        };
    }
}