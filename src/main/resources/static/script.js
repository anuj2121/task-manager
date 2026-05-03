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
            showMessage("Login failed ❌", "error");
            return;
        }

        const token = await res.text();
        const payload = JSON.parse(atob(token.split('.')[1]));

        localStorage.setItem("token", token);
        localStorage.setItem("role", payload.role);
        localStorage.setItem("email", payload.sub);

        showMessage("Login success ✅");
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error(error);
        showMessage("Login error ❌", "error");
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
            showMessage("Registered successfully ✅");
            window.location.href = "index.html";
        } else {
            const text = await res.text();
            showMessage("Error: " + text, "error");
        }

    } catch (err) {
        console.error(err);
        showMessage("Server error ❌", "error");
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
    showMessage("Project created ✅ ID: " + PROJECT_ID);
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

    showMessage("Member added ✅");
}

// 📌 CREATE TASK
async function createTask() {

    const token = getToken();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const userId = document.getElementById("assignUser").value;

    const res = await fetch(`/api/tasks?userId=${userId}&projectId=${PROJECT_ID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ title, description })
    });

    if (res.ok) {
        showMessage("Task created ✅");

        // clear inputs
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("assignUser").value = "";

        loadTasks();
    } else {
        showMessage("Error creating task ❌", "error");
    }
}

// 🔄 UPDATE STATUS
async function updateStatus(taskId, status) {

    const token = getToken();

    const res = await fetch(`/api/tasks/${taskId}/status?status=${status}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (res.ok) {
        showMessage("Task updated ✅");
        loadTasks();
    } else {
        showMessage("Update failed ❌", "error");
    }
}

// 📊 LOAD TASKS
async function loadTasks() {

    const token = getToken();

    const res = await fetch(`/api/tasks/project/${PROJECT_ID}`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!res.ok) {
        showMessage("Unauthorized ❌", "error");
        return;
    }

    const data = await res.json();

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    // 📊 COUNTERS
    let total = data.length;
    let todo = 0, inprogress = 0, done = 0, overdue = 0;

    data.forEach(t => {

        if (t.status === "TODO") todo++;
        else if (t.status === "IN_PROGRESS") inprogress++;
        else if (t.status === "DONE") done++;
        else if (t.status === "OVERDUE") overdue++;

        const div = document.createElement("div");
        div.className = "task";

        const role = localStorage.getItem("role");

        if (role === "ADMIN") {
            div.innerHTML = `
                <b>${t.title}</b><br>
                Status: ${t.status}<br>

                <button onclick="updateStatus(${t.id}, 'IN_PROGRESS')">Start</button>
                <button onclick="updateStatus(${t.id}, 'DONE')">Done</button>
                <button onclick="updateStatus(${t.id}, 'OVERDUE')">Overdue</button>
            `;
        } else {
            div.innerHTML = `
                <b>${t.title}</b><br>
                Status: ${t.status}
            `;
        }

        list.appendChild(div);
    });

    // 📊 UPDATE STATS
    document.getElementById("total").innerText = total;
    document.getElementById("todo").innerText = todo;
    document.getElementById("inprogress").innerText = inprogress;
    document.getElementById("done").innerText = done;
    document.getElementById("overdue").innerText = overdue;
}

// 🔔 MESSAGE BOX
function showMessage(text, type = "success") {
    const box = document.getElementById("messageBox");
    if (!box) return;

    box.innerText = text;
    box.style.display = "block";

    box.style.background = type === "error" ? "#ef4444" : "#4caf50";

    setTimeout(() => {
        box.style.display = "none";
    }, 2000);
}