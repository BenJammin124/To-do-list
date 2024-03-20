import { addTaskToProject } from "./index";
import Task from "./task"

let currentTaskElement;

export function renderTask(task) {
  const content = document.querySelector('.content');

  const taskElement = document.createElement('div');
  taskElement.classList.add('task');
  taskElement.innerHTML = `
  <h3>${task.task}</h3>
  <p>${task.description}</p>
  <p>${task.dueDate}</p>
  <p>${task.priority}</p>
  <button class="edit-task">Edit</button>
  <button class="delete-task">Delete</button>
  `;

  content.append(taskElement);

  const editButton = taskElement.querySelector('.edit-task');
  editButton.addEventListener('click', () => {
    const taskName = document.getElementById('taskName');
    const taskDescription = document.getElementById('taskDescription');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskPriority = document.getElementById('taskPriority');
    const taskList = document.querySelector('#listSelect');
    openModal();
    taskName.value = task.task;
    taskDescription.value = task.description;
    taskDueDate.value = task.dueDate;
    taskPriority.value = task.priority;
    taskList.value = task.listName;


    // Update currentTaskElement to the new task element
    currentTaskElement = taskElement;
  });

  const deleteButton = taskElement.querySelector('.delete-task');
  deleteButton.addEventListener('click', () => {

    taskElement.remove();
  })
  return {
    taskElement
  }
}

export function openModal() {
  const modal = document.querySelector('.taskModal');
  modal.showModal();
}

export function closeModal() {
  const modal = document.querySelector('.taskModal');
  modal.close();
}

export function initializeModal() {
  const btn = document.getElementById('openModalBtn');
  const span = document.querySelector('.close');

  btn.addEventListener('click', openModal)
  span.addEventListener('click', closeModal)
}

export function handleFormSubmission() {
  const taskForm = document.getElementById('taskForm');
  const taskList = document.querySelector('#listSelect');

  taskForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (currentTaskElement) {
      currentTaskElement.remove();
    }

    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDueDate = document.getElementById('taskDueDate').value;
    const taskPriority = document.getElementById('taskPriority').value;

    const newTask = new Task(taskName, taskDescription, taskDueDate, taskPriority);
    newTask.setListName(taskList.value);
    addTaskToProject(newTask);
    renderTask(newTask)

    console.log('New Task:', newTask);

    closeModal();
    taskForm.reset();
  });
}

