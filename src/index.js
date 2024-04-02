import Task from './task';
import Project from './project';
import { initializeModal, handleFormSubmission, renderTask, ScreenController } from './dom';
import './style.css';

ScreenController();



// const listsContainer = document.querySelector('[data-lists]')
// let projects = [inbox, all, today, upcoming]

// function renderProjects() {
//   clearElement(listsContainer)
//   projects.forEach(list => {
//     const listElement = document.createElement('li');
//     listElement.classList.add('list-name');
//     listElement.innerText = list.getTitle();
//     listsContainer.appendChild(listElement)
//   })
// }

// function clearElement(element) {
//   while (element.firstChild) {
//     element.removeChild(element.firstChild)
//   }
// }

// const taskList = document.querySelector('#listSelect');

// function getCurrentProjects() {
//   projects.forEach((project) => {
//     const addListToOption = document.createElement('option');
//     addListToOption.value = project.getTitle();
//     addListToOption.innerHTML = project.getTitle();
//     taskList.append(addListToOption);
//   })
// }

