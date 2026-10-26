// Initialize stored users array if empty
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([]));
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users"));
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Toggle between Register and Login UI
function toggleForm(type) {
  const regBox = document.getElementById("register-box");
  const loginBox = document.getElementById("login-box");
  if (type === "login") {
    regBox.style.display = "none";
    loginBox.style.display = "block";
  } else {
    regBox.style.display = "block";
    loginBox.style.display = "none";
  }
}

// Handle Registration
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const role = document.getElementById("regRole").value;

    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      alert("Email already registered!");
      return;
    }

    users.push({ name, email, password, role });
    saveUsers(users);
    alert("Registration successful! Please login.");
    toggleForm("login");
  });
}

// Handle Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid email or password!");
    }
  });
}

// Dashboard Page Setup
if (window.location.pathname.includes("dashboard.html")) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    window.location.href = "index.html";
  } else {
    document.getElementById(
      "welcomeHeader"
    ).innerText = `Welcome, ${currentUser.name} (${currentUser.role.toUpperCase()})`;

    // Display sections based on user role rules
    if (currentUser.role === "admin") {
      document.getElementById("adminSection").style.display = "block";
      loadAdminView();
    } else if (currentUser.role === "coordinator") {
      document.getElementById("coordinatorSection").style.display = "block";
      loadCoordinatorView();
    } else if (currentUser.role === "student") {
      document.getElementById("studentSection").style.display = "block";
      document.getElementById(
        "studentProfileInfo"
      ).innerText = `Name: ${currentUser.name} | Email: ${currentUser.email}`;
    }
  }
}

// Admin Capabilities: View all Coordinators and Students, add Coordinators/Students
function loadAdminView() {
  const users = getUsers();
  const list = document.getElementById("allUsersList");
  list.innerHTML = "";

  // Admin sees Coordinators and Students
  const accessibleUsers = users.filter((u) => u.role !== "admin");
  accessibleUsers.forEach((u) => {
    const li = document.createElement("li");
    li.textContent = `${u.name} - ${u.email} [Role: ${u.role}]`;
    list.appendChild(li);
  });
}

const adminAddUserForm = document.getElementById("adminAddUserForm");
if (adminAddUserForm) {
  adminAddUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("adminUserName").value;
    const email = document.getElementById("adminUserEmail").value;
    const password = document.getElementById("adminUserPass").value;
    const role = document.getElementById("adminUserRole").value;

    const users = getUsers();
    users.push({ name, email, password, role });
    saveUsers(users);
    alert(`${role} added successfully!`);
    loadAdminView();
    adminAddUserForm.reset();
  });
}

// Coordinator Capabilities: View and add ONLY Students
function loadCoordinatorView() {
  const users = getUsers();
  const list = document.getElementById("studentsList");
  list.innerHTML = "";

  // Coordinator can ONLY see students (Admin users are restricted/filtered out)
  const students = users.filter((u) => u.role === "student");
  students.forEach((u) => {
    const li = document.createElement("li");
    li.textContent = `${u.name} - ${u.email} [Role: Student]`;
    list.appendChild(li);
  });
}

const coordAddStudentForm = document.getElementById("coordAddStudentForm");
if (coordAddStudentForm) {
  coordAddStudentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("coordStudentName").value;
    const email = document.getElementById("coordStudentEmail").value;
    const password = document.getElementById("coordStudentPass").value;

    const users = getUsers();
    users.push({ name, email, password, role: "student" });
    saveUsers(users);
    alert("Student added successfully!");
    loadCoordinatorView();
    coordAddStudentForm.reset();
  });
}

// Logout
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}