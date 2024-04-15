import Task from "./task";
import Project from './project';
import ToDo from './todo';
import Trash from './Images/trash.svg';
import Edit from './Images/edit.svg';
import { getFromLocalStorage, saveToLocalStorage, getIdFromLocalStorage } from "./localStorage";
import { isToday, isThisWeek, compareAsc, format, parseISO } from "date-fns";

export function ScreenController() {
  const content = document.querySelector('.content');
  const projectContainer = document.querySelector('[data-lists]');
  const userProjectsContainer = document.querySelector('.project-list-created');
  const taskNameInput = document.getElementById('taskName');
  const descriptionInput = document.getElementById('taskDescription');
  const dueDateInput = document.getElementById('taskDueDate');
  const priorityInput = document.getElementById('taskPriority');
  const projectInput = document.querySelector('#listSelect');
  const projectName = document.querySelectorAll('.project-name');
  const projectForm = document.querySelector('.new-project-form');
  const projectFormTitle = document.querySelector('#new-project-title');
  const taskForm = document.querySelector('#new-task-form');
  const sideBar = document.querySelector('.side-bar');
  const editButton = document.querySelector('.icon.edit');
  const editProjectForm = document.querySelector('#edit-project-form');
  const projectInputEdit = document.querySelector('#editListSelect');
  const editTaskForm = document.querySelector('#edit-task-form');
  const taskEditTaskList = document.querySelector('#editListSelect');
  let selectedProject = document.querySelector('.project-name.selected')

  const todo = new ToDo;
  const inbox = new Project('Inbox');
  const today = new Project('Today');
  const upcoming = new Project('This Week');
  const all = new Project('All');
  const stuff = new Project('Stuff');
  const task = new Task('Bread', 'sandwiches', format(parseISO('2024-04-01'), 'MM-dd-yyyy'), 'High', 'Inbox');
  const task2 = new Task('Milk', 'basics betchs', format(parseISO('2024-04-01'), 'MM-dd-yyyy'), 'High', 'Inbox');
  const task3 = new Task('Fix sink', 'leaky faucet', format(parseISO('2024-04-01'), 'MM-dd-yyyy'), 'Medium', 'Inbox');
  inbox.addTask(task);
  inbox.addTask(task2)
  inbox.addTask(task3);
  todo.addProject(inbox);
  todo.addProject(today)
  todo.addProject(upcoming)
  todo.addProject(all)
  todo.addProject(stuff);
  // todo.projects = getFromLocalStorage() || [];

  console.log(todo);
  todo.allTasks();

  //render project names in sidebar
  const renderUserCreatedProjects = () => {
    clearElement(userProjectsContainer);
    todo.projects.forEach((project) => {
      if (project.getTitle() !== 'Inbox' &&
        project.getTitle() !== 'Today' &&
        project.getTitle() !== 'This Week' &&
        project.getTitle() !== 'All') {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project-div')
        const icons = document.createElement('div');
        icons.classList.add('icons');
        const edit = new Image();
        edit.src = Edit;
        const trash = new Image();
        trash.src = Trash;
        edit.classList.add('edit');
        trash.classList.add('trash');
        const listElement = document.createElement('div');
        listElement.dataset.listId = project.id;
        trash.dataset.listId = project.id;
        edit.dataset.listId = project.id;
        listElement.classList.add('project-name');
        listElement.innerText = project.getTitle();
        icons.append(edit);
        icons.append(trash);
        projectDiv.append(listElement)
        projectDiv.append(icons);
        userProjectsContainer.append(projectDiv)
        console.log(project.getTitle())
      }
    })
  }
  // Inbox, Today, This Week, All; Defaults
  const renderDefaultProjects = () => {
    clearElement(projectContainer);
    for (let i = 0; i < 4 && i < todo.projects.length; i++) {
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('project-div');
      const listElement = document.createElement('div');
      listElement.dataset.listId = todo.projects[i].id;
      listElement.classList.add('project-name');
      listElement.innerText = todo.projects[i].getTitle();
      projectDiv.append(listElement);
      projectContainer.appendChild(projectDiv);
    }
  }

  function getProjectsForDropdown() {
    clearElement(projectInput)
    todo.projects.forEach((project) => {
      const addListToOption = document.createElement('option');
      addListToOption.value = project.getTitle();
      addListToOption.innerHTML = project.getTitle();
      projectInput.append(addListToOption);
    })
  }

  function getProjectsForDropdownEdit() {
    clearElement(projectInputEdit)
    todo.projects.forEach((project) => {
      const addListToOption = document.createElement('option');
      addListToOption.value = project.getTitle();
      addListToOption.innerHTML = project.getTitle();
      projectInputEdit.append(addListToOption);
    })
  }


  function clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild)
    }
  }

  function renderSelectedProject(project) {
    content.innerHTML = '';
    const sortSelect = document.createElement('select');
    sortSelect.setAttribute('name', 'sort-by');
    sortSelect.setAttribute('id', 'sort-by');
    sortSelect.classList.add('sort');
    sortSelect.innerHTML = `
    <option value="priority-low">Priority Low</option>
    <option value="priority-high">Priority High</option>
    <option value="date">Date</option>
    `;
    const title = document.createElement('h2');
    const header = document.createElement('header');
    title.innerText = project.getTitle();
    header.append(title);
    header.append(sortSelect);
    content.append(header);
    project.tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task-element');
      taskElement.innerHTML = `
      <div class="task-name-description">
      <input type="checkbox" data-task-id = "${task.id}" id="${task.task}" class="todo-check" ${task.completed ? 'checked' : ''} >
      <label for="${task.task}" class="todo-label">${task.task}</label> 
      <p class="todo-descript">${task.description}</p>
      </div>
      <p>${task.dueDate}</p>
      <p>${task.priority}</p>
      <button class="edit-task" data-task-id="${task.id}">Edit</button>
      <button class="delete-task" data-task-id="${task.id}">Delete</button>
      `;
      content.append(taskElement);
    })
    //sets selected class on currently rendered project
    const projectNames = document.querySelectorAll('.project-name');
    projectNames.forEach(projectName => {
      if (projectName.dataset.listId === project.id.toString()) {
        projectName.classList.add('selected');
      } else {
        projectName.classList.remove('selected');
      }
    })
  }
  //finds project based on title
  function findProject() {
    return todo.projects.find(project => project.title === projectInput.value)
  }

  function findProjectTitle() {
    return todo.projects.find(project => project.title === taskEditTaskList.value)
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
    //finds project with selected class, gets the unique id, and renders selected project,
    //if project is already selected when new task is created.
    const selectedProjectId = document.querySelector('.project-name.selected').dataset.listId;
    const currentProject = getCurrentProject(parseFloat(selectedProjectId));
    renderSelectedProject(currentProject);
    console.log(newDate)
    console.log(foundProject)
    console.log(todo)
  }

  function createNewProject(e) {
    e.preventDefault();
    const projectTitle = new Project(projectFormTitle.value);
    todo.addProject(projectTitle);
    renderUserCreatedProjects();
    getProjectsForDropdown();
    projectForm.reset();
    console.log(todo)
  }

  function taskPriorityToValue(priority) {
    switch (priority) {
      case 'Low':
        return 0;
      case 'Medium':
        return 1;
      case 'High':
        return 2;
      default:
        return 0;
    }
  }


  function getCurrentTask(id) {
    for (const project of todo.projects) {
      const foundTask = project.tasks.find(task => task.id === id);
      if (foundTask) {
        return foundTask;
      }
    }
  }

  function findTaskIndex(task) {
    let foundIndex = -1;
    for (const project of todo.projects) {
      const index = project.tasks.findIndex(t => t.task === task.task);
      if (index !== -1) {
        foundIndex = index;
        break;
      }
    }
    return foundIndex;
  }

  function sortByPriorityLow(i) {
    todo.projects[i].tasks.sort((a, b) => taskPriorityToValue(a.priority) - taskPriorityToValue(b.priority))
  }

  function sortByPriorityHigh(i) {
    todo.projects[i].tasks.sort((a, b) => taskPriorityToValue(b.priority) - taskPriorityToValue(a.priority))
  }

  function sortThisPriorityLow(project) {
    const thing = findProjectIndex(project);
    sortByPriorityLow(thing);
  }

  function sortThisPriorityHigh(project) {
    const thing = findProjectIndex(project);
    sortByPriorityHigh(thing);
  }

  function sortBy(sorter) {
    const selectedProjectId = document.querySelector('.project-name.selected').dataset.listId;
    const currentProject = getCurrentProject(parseFloat(selectedProjectId));
    switch (sorter) {
      case 'priority-low':
        return sortThisPriorityLow(currentProject), renderSelectedProject(currentProject);
      case 'priority-high':
        return sortThisPriorityHigh(currentProject), renderSelectedProject(currentProject);
      case 'date':
        return currentProject.sortByDate(), renderSelectedProject(currentProject);
    }
  }
  //finds project based on unique id
  function getCurrentProject(id) {
    return todo.projects.find(project => id === project.id)
  }

  function findProjectIndex(project) {
    return todo.projects.indexOf(project)
  }

  let taskEditData = null;
  let taskEditProject = null;

  content.addEventListener('click', e => {
    if (e.target.className === 'todo-check') {
      const selectedTaskId = e.target.dataset.taskId;
      const currentTask = getCurrentTask(parseFloat(selectedTaskId));
      currentTask.completed = !currentTask.completed;
      console.log(currentTask);
    } else if (e.target.className === 'edit-task') {
      getProjectsForDropdownEdit();
      const taskTitle = document.querySelector('#editTaskName');
      const taskDescription = document.querySelector('#editTaskDescription');
      const dueDate = document.querySelector('#editTaskDueDate');
      const taskPriority = document.querySelector('#editTaskPriority');
      const selectedTaskId = e.target.dataset.taskId;
      const currentTask = getCurrentTask(parseFloat(selectedTaskId));
      taskTitle.value = currentTask.task;
      taskDescription.value = currentTask.description;
      dueDate.value = format(currentTask.dueDate, 'yyyy-MM-dd');
      taskPriority.value = currentTask.priority;
      taskEditTaskList.value = currentTask.listName;
      openEditTaskModal();
      taskEditData = currentTask;
      console.log(currentTask);
      const selectedProjectId = document.querySelector('.project-name.selected').dataset.listId;
      const currentProject = getCurrentProject(parseFloat(selectedProjectId));
      taskEditProject = currentProject;
      console.log(currentProject)
    } else if (e.target.className === 'delete-task') {
      const selectedTaskId = e.target.dataset.taskId;
      const currentTask = getCurrentTask(parseFloat(selectedTaskId));
      const selectedProjectId = document.querySelector('.project-name.selected').dataset.listId;
      const currentProject = getCurrentProject(parseFloat(selectedProjectId));
      currentProject.deleteTask(findTaskIndex(currentTask));
      const indexToRemove = todo.projects[3].tasks.findIndex(task => task.task === currentTask.task);
      todo.projects[3].deleteTask(indexToRemove)
      // currentProject.sortByDate();
      sortThisPriorityHigh(currentProject);
      renderSelectedProject(currentProject)
      console.log(currentProject)
      console.log(currentTask)
    } else if (e.target.className === 'sort') {
      const sortValue = document.querySelector('.sort').value;
      sortBy(sortValue);
    }
  })

  editTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const taskEditTitle = document.querySelector('#editTaskName');
    const taskEditDescription = document.querySelector('#editTaskDescription');
    const taskEditDueDate = document.querySelector('#editTaskDueDate');
    const taskEditTaskPriority = document.querySelector('#editTaskPriority');
    taskEditData.editTask(taskEditTitle.value, taskEditDescription.value, format(parseISO(taskEditDueDate.value), 'MM-dd-yyyy'), taskEditTaskPriority.value, taskEditTaskList.value);
    taskEditProject.deleteTask(findTaskIndex(taskEditData));
    const newProject = findProjectTitle(taskEditData);
    newProject.addTask(taskEditData);
    renderSelectedProject(taskEditProject);
    closeEditTaskModal();
    console.log(todo)
  })

  let projectTitleData = null;

  sideBar.addEventListener('click', e => {
    if (e.target.className === 'project-name') {
      let selectedProjectId = e.target.dataset.listId
      const currentProject = getCurrentProject(parseFloat(selectedProjectId));
      if (currentProject.title === 'Today') {
        currentProject.tasks = todo.todayTasks()
      } else if (currentProject.title === 'This Week') {
        currentProject.tasks = todo.thisWeekTasks();
      }
      console.log(currentProject)
      renderSelectedProject(currentProject);
    } else if (e.target.className === 'edit') {
      const projectEditTitle = document.querySelector('#edit-project-title');
      let selectedProjectId = e.target.dataset.listId;
      const currentProject = getCurrentProject(parseFloat(selectedProjectId));
      projectEditTitle.value = currentProject.getTitle();
      projectModal();
      projectTitleData = currentProject;
      console.log(currentProject)
    } else if (e.target.className === 'trash') {
      let selectedProjectId = e.target.dataset.listId;
      const currentProject = getCurrentProject(parseFloat(selectedProjectId));
      todo.deleteProject(findProjectIndex(currentProject))
      const tasksToRemove = currentProject.getProjectList()
      renderUserCreatedProjects();
      todo.projects[3].tasks = todo.projects[3].tasks.filter(task => tasksToRemove.every(removeTask => removeTask.id !== task.id))
      renderSelectedProject(inbox)
      console.log(todo)
    }
  })

  editProjectForm.addEventListener('submit', e => {
    e.preventDefault();
    const projectEditTitle = document.querySelector('#edit-project-title');
    projectTitleData.setTitle(projectEditTitle.value);
    console.log(todo)
    renderUserCreatedProjects();
    getProjectsForDropdown();
    closeProjectModal();
  })

  function loadHome() {
    renderSelectedProject(inbox);
  }


  projectForm.addEventListener('submit', createNewProject)

  taskForm.addEventListener('submit', createNewTask)


  function openEditTaskModal() {
    const editTModal = document.querySelector('.editTaskModal')
    editTModal.showModal();
  }

  function closeEditTaskModal() {
    const editTModal = document.querySelector('.editTaskModal')
    editTModal.close();
  }

  function initializeEditTaskModal() {
    const editTaskButtons = document.querySelectorAll('.edit-task')
    const span = document.querySelector('.editTaskModal .close')

    editTaskButtons.forEach(button => {
      button.addEventListener('click', openEditTaskModal);
    })
    span.addEventListener('click', closeEditTaskModal)
  }

  function projectModal() {
    const pModal = document.querySelector('.projectModal')
    pModal.showModal();
  }

  function closeProjectModal() {
    const pModal = document.querySelector('.projectModal')
    pModal.close();
  }

  function initializePModal() {
    const btn = document.querySelector('.edit');
    const span = document.querySelector('.close');

    btn.addEventListener('click', projectModal);
    span.addEventListener('click', closeProjectModal)
  }

  renderUserCreatedProjects();
  renderDefaultProjects();
  getProjectsForDropdown();
  initializeModal();
  initializePModal();
  initializeEditTaskModal();

  loadHome();

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
  const modal = document.querySelector('.taskModal');
  const span = modal.querySelector('.close');

  btn.addEventListener('click', openModal)
  span.addEventListener('click', closeModal)
}

