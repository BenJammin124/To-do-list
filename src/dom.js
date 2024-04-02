import Task from "./task";
import Project from './project';
import ToDo from './todo';
import { isToday, isThisWeek, compareAsc, format, parseISO } from "date-fns";

export function ScreenController() {
  const content = document.querySelector('.content');
  const projectContainer = document.querySelector('[data-lists]')
  const userProjectsContainer = document.querySelector('.project-list-created')
  const taskNameInput = document.getElementById('taskName');
  const descriptionInput = document.getElementById('taskDescription');
  const dueDateInput = document.getElementById('taskDueDate');
  const priorityInput = document.getElementById('taskPriority');
  const projectInput = document.querySelector('#listSelect');
  const projectName = document.querySelectorAll('.project-name')
  const projectForm = document.querySelector('.new-project-form')
  const taskForm = document.querySelector('#new-task-form');
  const sideBar = document.querySelector('.side-bar')



  const todo = new ToDo;
  const inbox = new Project('Inbox');
  const today = new Project('Today');
  const upcoming = new Project('This Week');
  const all = new Project('All');
  const stuff = new Project('Stuff');
  const task = new Task('Bread', 'sandwiches', format(parseISO('2024-04-01'), 'MM-dd-yyyy'), 'High', 'Inbox');
  const task2 = new Task('Milk', 'basics', format(parseISO('2024-04-01'), 'MM-dd-yyyy'), 'High', 'Index');
  const task3 = new Task('Fix sink', 'leaky faucet', format(parseISO('2024-04-01'), 'MM-dd-yyyy'), 'medium', 'Inbox');
  inbox.addTask(task);
  inbox.addTask(task2)
  inbox.addTask(task3);
  todo.addProject(inbox);
  todo.addProject(today)
  todo.addProject(upcoming)
  todo.addProject(all)
  todo.addProject(stuff)
  console.log(todo);
  todo.allTasks();

  const renderUserCreatedProjects = () => {
    clearElement(userProjectsContainer);
    todo.projects.forEach((project) => {
      if (project.getTitle() !== 'Inbox' &&
        project.getTitle() !== 'Today' &&
        project.getTitle() !== 'This Week' &&
        project.getTitle() !== 'All') {
        const listElement = document.createElement('li');
        listElement.dataset.listId = project.id;
        listElement.classList.add('project-name');
        listElement.innerText = project.getTitle();
        userProjectsContainer.append(listElement)
        console.log(project.getTitle())
      }
    })
  }
  // Inbox, Today, This Week, All
  const renderDefaultProjects = () => {
    clearElement(projectContainer);
    for (let i = 0; i < 4 && i < todo.projects.length; i++) {
      const listElement = document.createElement('li');
      listElement.dataset.listId = todo.projects[i].id;
      listElement.classList.add('project-name');
      listElement.innerText = todo.projects[i].getTitle();
      projectContainer.appendChild(listElement)
    }

  }

  function getProjectsForDropdown() {
    todo.projects.forEach((project) => {
      const addListToOption = document.createElement('option');
      addListToOption.value = project.getTitle();
      addListToOption.innerHTML = project.getTitle();
      projectInput.append(addListToOption);
    })
  }


  function clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild)
    }
  }

  function renderSelectedProject(project) {
    content.innerHTML = '';
    project.tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task-element');
      taskElement.innerHTML = `
      <h3>${task.task}</h3>
      <p>${task.description}</p>
      <p>${task.dueDate}</p>
      <p>${task.priority}</p>
      <button class="edit-task">Edit</button>
      <button class="delete-task">Delete</button>
      `;
      content.append(taskElement);
    })

    const projectNames = document.querySelectorAll('.project-name');
    projectNames.forEach(projectName => {
      if (projectName.dataset.listId === project.id.toString()) {
        projectName.classList.add('selected');
      } else {
        projectName.classList.remove('selected');
      }
    })
  }
  function findProject() {
    return todo.projects.find(project => project.title === projectInput.value)
  }

  const createNewTask = (e) => {
    e.preventDefault();
    const newDate = format(parseISO(dueDateInput.value), 'MM-dd-yyyy')
    const createTask = new Task(taskNameInput.value, descriptionInput.value, newDate, priorityInput.value, projectInput.value)
    const foundProject = findProject()
    foundProject.addTask(createTask)
    all.addTask(createTask)
    closeModal();
    taskForm.reset();

    const selectedProjectId = document.querySelector('.project-name.selected').dataset.listId;
    const currentProject = getCurrentProject(parseFloat(selectedProjectId));
    renderSelectedProject(currentProject);
    console.log(newDate)
    console.log(foundProject)
    console.log(todo)
  }

  function getCurrentProject(id) {
    return todo.projects.find(project => id === project.id)
  }

  renderUserCreatedProjects();
  renderDefaultProjects();
  getProjectsForDropdown();
  initializeModal();


  sideBar.addEventListener('click', e => {
    if (e.target.className === 'project-name') {
      let selectedProjectId = e.target.dataset.listId
      const currentProject = getCurrentProject(parseFloat(selectedProjectId));
      console.log(currentProject)
      renderSelectedProject(currentProject);

    }
  })

  taskForm.addEventListener('submit', createNewTask)
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

