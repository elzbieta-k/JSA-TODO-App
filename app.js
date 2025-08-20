const listContainer = document.querySelector("#list-container");

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");

const showCompletedInput = document.querySelector("#show-complete");

let filters = { showCompleted: false };
let tasks = [];

showCompletedInput.addEventListener("change", (e) => {
  filters.showCompleted = e.target.checked;
  renderPage();
});

const saveTasksToStorage = () =>
  localStorage.setItem("tasks", JSON.stringify(tasks));

//use local storage

//Create a to do
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(taskForm);
  const userInput = formData.get("task-input");
  taskInput.value = "";

  //validation
  if (!userInput) {
    return alert("Add some tasks");
  }

  tasks.push({
    timestamp: new Date(),
    description: userInput,
    complete: false,
  });
  saveTasksToStorage();
  renderPage();
});

//load in each individual task
const buildPage = (tasks) => {
  //   listContainer.innerHTML = ""; - not use this one
  listContainer.replaceChildren();
  //Loop over each task, create come elements
  tasks.forEach((task) => {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    const descriptionElement = document.createElement("input");
    descriptionElement.type = "text";
    descriptionElement.classList.add("description");
    descriptionElement.value = task.description;
    descriptionElement.readOnly = true;

    taskContainer.append(
      completeTaskInput(task),
      descriptionElement,
      editTaskButton(task, descriptionElement),
      deleteTaskButton(task)
    );
    listContainer.append(taskContainer);
  });
};

const deleteTaskButton = (task) => {
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-button");
  deleteBtn.textContent = "Delete";

  //event..function
  deleteBtn.addEventListener("click", () => {
    const taskIndex = tasks.indexOf(task);
    if (taskIndex > -1) {
      tasks.splice(taskIndex, 1);
    }

    saveTasksToStorage();
    renderPage();
  });

  return deleteBtn;
};

const editTaskButton = (task, inputElement) => {
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-button");
  editBtn.textContent = "Edit";

  editBtn.addEventListener("click", () => {
    task.description = inputElement.value;
    inputElement.readOnly = !inputElement.readOnly;
    editBtn.textContent = inputElement.readOnly ? "Edit" : "Save";
    saveTasksToStorage();
  });
  return editBtn;
};

const completeTaskInput = (task) => {
  const inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.classList.add("completed");
  inputElement.checked = task.complete;

  inputElement.addEventListener("change", (e) => {
    task.complete = e.target.checked;
    saveTasksToStorage();
    renderPage();
  });
  return inputElement;
};

const filterArray = (tasks) => {
  return tasks.filter((task) => filters.showCompleted || !task.complete);
};

//render our page
const renderPage = () => {
  // Load in tasks from local storage
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
  // Filters, A-Z, Z-A, Newest to Oldest, vice versa

  buildPage(filterArray(tasks));
};

renderPage();

//Local Storage

// In what format, do we store data i n LocalStorage --> string
// how can we convert the string from localStorage to an object --> JSON.parse()
// where is the data stored -- users client , local Storage in the browser
