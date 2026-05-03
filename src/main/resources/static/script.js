// ✅ SAME SERVER (Railway)
const BASE_URL = "";
console.log("JS LOADED");

let PROJECT_ID = 1;

// 🔐 GET TOKEN
function getToken() {
    return localStorage.getItem("token");
}

// 🔐 LOGOUT
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// 🚀 INIT (DASHBOARD LOAD)
function init() {
    const token = getToken();

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    // Show user info
    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
        userInfo.innerText = `${email} (${role})`;
    }

    // Hide admin section for MEMBER
    if (role !== "ADMIN") {
        const adminSection = document.getElementById("adminSection");
        if (adminSection) {
            adminSection.style.display = "none";
        }
    }

    loadTasks();
}

// 🔐 LOGIN
async function login() {
    try {
        const res = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });

        if (!res.ok) {
            alert("Login failed ❌");
            return;
        }

        const token = await res.text(); // backend returns plain token

        const payload = JSON.parse(atob(token.split('.')[1]));

        localStorage.setItem("token", token);
        localStorage.setItem("role", payload.role);
        localStorage.setItem("email", payload.sub);

        alert("Login success ✅");

        window.location.href = "dashboard.html";

    } catch (error) {
        console.error(error);
        alert("Login error ❌");
    }
}

// 📝 REGISTER
async function register() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
        const res = await fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password, role })
        });

        if (res.ok) {
            alert("Registered successfully ✅");
            window.location.href = "index.html";
        } else {
            const text = await res.text();
            alert("Error: " + text);
        }

    } catch (err) {
        console.error(err);
        alert("Server error ❌");
    }
}

// 📁 CREATE PROJECT
async function createProject() {

    const token = getToken();

    const name = document.getElementById("projectName").value;
    const description = document.getElementById("projectDesc").value;

    const res = await fetch(`/api/projects?userId=1`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name, description })
    });

    const data = await res.json();

    PROJECT_ID = data.id;
    alert("Project created ✅ ID: " + PROJECT_ID);
}

// 👥 ADD MEMBER
async function addMember() {

    const token = getToken();
    const userId = document.getElementById("memberId").value;

    await fetch(`/api/projects/${PROJECT_ID}/members?userId=${userId}`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    alert("Member added ✅");
}

// 📌 CREATE TASK
async function createTask() {

    const token = getToken();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const userId = document.getElementById("assignUser").value;

    if (!userId || isNaN(userId)) {
        alert("Enter valid User ID ❌");
        return;
    }

    const res = await fetch(
        `/api/tasks?userId=${userId}&projectId=${PROJECT_ID}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ title, description })
        }
    );

    if (res.ok) {
        alert("Task created ✅");
        loadTasks();
    } else {
        const text = await res.text();
        alert("Error: " + text);
    }
}

// 🔄 UPDATE STATUS
async function updateStatus(taskId, status) {

    const token = getToken();

    await fetch(`/api/tasks/${taskId}?status=${status}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadTasks();
}

// 📊 LOAD TASKS
async function loadTasks() {

    const token = getToken();

    if (!token) {
        alert("Please login first ❌");
        window.location.href = "index.html";
        return;
    }

    const res = await fetch(`/api/tasks/project/${PROJECT_ID}`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!res.ok) {
        alert("Session expired ❌");
        localStorage.clear();
        window.location.href = "index.html";
        return;
    }

    const data = await res.json();

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    data.forEach(t => {
        const div = document.createElement("div");
        div.className = "task";
        div.innerText = t.title + " - " + t.status;
        list.appendChild(div);
    });
}
function showMessage(text, type = "success") {
    const box = document.getElementById("messageBox");

    if (!box) return;

    box.innerText = text;
    box.style.display = "block";

    if (type === "error") {
        box.style.background = "#ef4444";
    } else {
        box.style.background = "#4caf50";
    }

    setTimeout(() => {
        box.style.display = "none";
    }, 2000);
}