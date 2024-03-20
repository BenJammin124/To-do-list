import CreateTask from './task';
import NewProject from './project';
import { openModal, closeModal, initializeModal, handleFormSubmission } from './dom';
import './style.css';


const allLists = new NewProject('All');
const todayTasks = new NewProject('Today');
const upcomingTasks = new NewProject('Upcoming');


const listsContainer = document.querySelector('[data-lists]')
let projects = [allLists, todayTasks, upcomingTasks]

function renderProjects() {
  clearElement(listsContainer)
  projects.forEach(list => {
    const listElement = document.createElement('li');
    listElement.classList.add('list-name');
    listElement.innerText = list.getTitle();
    listsContainer.appendChild(listElement)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

const taskList = document.querySelector('#listSelect');

function getCurrentProjects() {
  projects.forEach((project) => {
    const addListToOption = document.createElement('option');
    addListToOption.value = project.getTitle();
    addListToOption.innerHTML = project.getTitle();
    taskList.append(addListToOption);
  })
}

function addTaskToProject(task) {
  if (taskList.value !== 'All')
    projects.forEach((project) => {
      if (taskList.value === project.getTitle()) {
        project.addTask(task);
        projects[0].addTask(task);
      }
    });

  if (taskList.value === 'All') {
    projects[0].addTask(task);
  }
  console.log(projects)
}

function initializeApp() {
  getCurrentProjects()
  renderProjects();
  initializeModal();
  handleFormSubmission();
}

initializeApp();


export { projects, addTaskToProject }