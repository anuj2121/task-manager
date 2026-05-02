const BASE_URL = "http://localhost:8080";
console.log("JS LOADED");

let PROJECT_ID = 1;

// 🔐 TOKEN
function getToken() {
    return localStorage.getItem("token");
}

// 🔐 LOGOUT
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

// 🚀 INIT (ROLE BASED)
function init() {

    const role = localStorage.getItem("role");

    // 🔥 hide admin section for MEMBER
    if (role !== "ADMIN") {
        const adminSection = document.getElementById("adminSection");
        if (adminSection) {
            adminSection.style.display = "none";
        }
    }

    loadTasks();
}

// 🔐 LOGIN (FIXED)
async function login() {
    console.log("LOGIN CLICKED");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const token = await res.text();

    // 🔥 Decode JWT
    const payload = JSON.parse(atob(token.split('.')[1]));

    const role = payload.role;
    const userEmail = payload.sub; // subject = email

    // 🔥 Save data
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", userEmail);

    alert("Login success ✅");
    window.location.href = "dashboard.html";
}

// 📁 CREATE PROJECT
async function createProject() {
    const token = getToken();

    const name = document.getElementById("projectName").value;
    const description = document.getElementById("projectDesc").value;

    const res = await fetch(`${BASE_URL}/api/projects?userId=1`, {
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

    await fetch(`${BASE_URL}/api/projects/${PROJECT_ID}/members?userId=${userId}`, {
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

    try {
        const res = await fetch(
            `${BASE_URL}/api/tasks?userId=${userId}&projectId=${PROJECT_ID}`,
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

            document.getElementById("title").value = "";
            document.getElementById("description").value = "";
            document.getElementById("assignUser").value = "";

            loadTasks();
        } else {
            const text = await res.text();
            alert("Error: " + text);
        }

    } catch (err) {
        console.error(err);
        alert("Network error ❌");
    }
}

// 🔄 UPDATE STATUS
async function updateStatus(taskId, status) {

    const token = getToken();

    await fetch(`${BASE_URL}/api/tasks/${taskId}?status=${status}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadTasks();
}

// 📝 REGISTER
async function register() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
        const res = await fetch(`${BASE_URL}/api/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password, role })
        });

        if (res.ok) {
            alert("Registered successfully ✅");
            window.location.href = "login.html";
        } else {
            const text = await res.text();
            alert("Error: " + text);
        }

    } catch (err) {
        console.error(err);
        alert("Server error ❌");
    }
}

// 📊 LOAD TASKS
async function loadTasks() {

    const token = getToken();

    const res = await fetch(
        `${BASE_URL}/api/tasks/project/${PROJECT_ID}/paged?page=0&size=50`,
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const data = await res.json();
    const tasks = data.content;

    let total = tasks.length;
    let todo = 0, inprogress = 0, done = 0, overdue = 0;

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    const today = new Date();

    tasks.forEach(task => {

        if (task.status === "TODO") todo++;
        if (task.status === "IN_PROGRESS") inprogress++;
        if (task.status === "DONE") done++;

        const created = new Date(task.createdAt);
        const diff = (today - created) / (1000 * 60 * 60 * 24);

        if (diff > 2 && task.status !== "DONE") overdue++;

        // 🔥 HIDE DONE TASKS
        if (task.status === "DONE") return;

        const div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
            <strong>${task.title}</strong><br>
            Status: ${task.status}<br>
            <button onclick="updateStatus(${task.id}, 'IN_PROGRESS')">Start</button>
            <button onclick="updateStatus(${task.id}, 'DONE')">Done</button>
        `;

        list.appendChild(div);
    });

    document.getElementById("total").innerText = total;
    document.getElementById("todo").innerText = todo;
    document.getElementById("inprogress").innerText = inprogress;
    document.getElementById("done").innerText = done;
    document.getElementById("overdue").innerText = overdue;
}
function init() {

    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    // 🔥 Show user info
    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
        userInfo.innerText = `${email} (${role})`;
    }

    // 🔥 Role-based UI
    if (role !== "ADMIN") {
        const adminSection = document.getElementById("adminSection");
        if (adminSection) {
            adminSection.style.display = "none";
        }
    }

    loadTasks();
}