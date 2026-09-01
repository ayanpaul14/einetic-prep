let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const countEl = document.getElementById("task-count");

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function generateId() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}


function updateCount(){
    const remaining = tasks.filter((t) => !t.completed).length;
    countEl.textContent = `${remaining} task${remaining !== 1 ? "s" : ""} remaining`;
}

function renderTasks() {
  list.innerHTML = ""; // clear and redraw (simple approach, fine for small lists)
 
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.dataset.id = task.id;
 
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(task.id));
 
    const span = document.createElement("span");
    span.textContent = task.text;
 
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));
 
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
 
  updateCount();
}
 
// ---- Actions ----
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
 
  tasks.push({ id: generateId(), text: trimmed, completed: false });
  saveTasks();
  renderTasks();
}
 
function toggleComplete(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}
 
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}
 
// ---- Events ----
form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop page reload — important since "no backend"
  addTask(input.value);
  input.value = "";
  input.focus();
});
 
// ---- Init ----
renderTasks();