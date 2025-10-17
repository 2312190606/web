
// DOM 元素
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.querySelector(".empty-state");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");

let todos = [];
let currentFilter = "all";

function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  dateElement.textContent = now.toLocaleDateString('en-US', options);
}
updateDate();

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function loadTodos() {
  const raw = localStorage.getItem("todos");
  todos = raw ? JSON.parse(raw) : [];
}

function filterTodos(filter) {
  if (filter === "all") return todos;
  if (filter === "active") return todos.filter(t => !t.completed);
  if (filter === "completed") return todos.filter(t => t.completed);
  return todos;
}

function updateItemsCount() {
  const uncompletedTodos = todos.filter((todo) => !todo.completed);
  itemsLeft.textContent = `${uncompletedTodos.length} item${uncompletedTodos.length !== 1 ? "s" : ""} left`;
}

function checkEmptyState() {
  const filteredTodos = filterTodos(currentFilter);
  if (filteredTodos.length === 0) emptyState.classList.remove("hidden");
  else emptyState.classList.add("hidden");
}

function renderTodos() {
  const filtered = filterTodos(currentFilter);
  todosList.innerHTML = "";
  if (filtered.length === 0) {
    // 空状态由 checkEmptyState 控制
  } else {
    filtered.forEach((todo, idx) => {
      const li = document.createElement("li");
      li.className = todo.completed ? "completed" : "";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => toggleTodo(idx));

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = todo.text;

      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.title = "Delete";
      delBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
      delBtn.addEventListener("click", () => deleteTodo(idx));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(delBtn);
      todosList.appendChild(li);
    });
  }
  updateItemsCount();
  checkEmptyState();
  saveTodos();
}

function addTodo(text) {
  if (text.trim() === "") return;
  const todo = {
    id: Date.now(),
    text: text,
    completed: false
  };
  todos.push(todo);
  saveTodos();
  renderTodos();
  taskInput.value = "";
}

function toggleTodo(idx) {
  todos[idx].completed = !todos[idx].completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(idx) {
  todos.splice(idx, 1);
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
}

// 事件绑定
addTaskBtn.addEventListener("click", () => addTodo(taskInput.value));
taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTodo(taskInput.value);
});
clearCompletedBtn.addEventListener("click", clearCompleted);
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

loadTodos();
renderTodos();
