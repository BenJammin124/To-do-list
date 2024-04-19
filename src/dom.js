import Task from "./task";
import Project from './project';
import ToDo from './todo';
import Trash from './Images/trash.svg';
import Edit from './Images/edit.svg';
import Today from './Images/today.svg';
import Week from './Images/week.svg';
import All from './Images/all.svg';
import Inbox from './Images/inbox.svg';

import { deleteToDo, loadToDo, saveToDo } from "./localStorage";
import { format, parseISO } from "date-fns";

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

  // todo.allTasks();

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
      projectDiv.dataset.listId = todo.projects[i].id;
      const listElement = document.createElement('div');
      listElement.dataset.listId = todo.projects[i].id;
      listElement.classList.add('project-name');
      listElement.innerText = todo.projects[i].getTitle();
      switch (todo.projects[i].getTitle()) {
        case 'Inbox':
          const inboxIcon = new Image();
          inboxIcon.src = Inbox;
          inboxIcon.classList.add('project-icons')
          projectDiv.append(inboxIcon)
          break;
        case 'Today':
          const todayIcon = new Image();
          todayIcon.src = Today;
          todayIcon.classList.add('project-icons')
          projectDiv.append(todayIcon)
          break;
        case 'This Week':
          const weekIcon = new Image();
          weekIcon.src = Week;
          weekIcon.classList.add('project-icons')
          projectDiv.append(weekIcon)
          break;
        case 'All':
          const allIcon = new Image();
          allIcon.src = All;
          allIcon.classList.add('project-icons')
          projectDiv.append(allIcon)
          break;
        default:
          console.log('yay')
      }
      projectDiv.append(listElement);
      projectContainer.appendChild(projectDiv);
    }
  }

  function getProjectsForDropdown() {
    clearElement(projectInput);
    todo.projects.forEach((project) => {
      if (project.getTitle() !== 'All' && project.getTitle() !== 'Today' && project.getTitle() !== 'This Week') {
        const addListToOption = document.createElement('option');
        addListToOption.value = project.getTitle();
        addListToOption.innerHTML = project.getTitle();
        projectInput.append(addListToOption);
      }
    });
  }

  function getProjectsForDropdownEdit() {
    clearElement(projectInputEdit)
    todo.projects.forEach((project) => {
      if (project.getTitle() !== 'All' && project.getTitle() !== 'Today' && project.getTitle() !== 'This Week') {
        const addListToOption = document.createElement('option');
        addListToOption.value = project.getTitle();
        addListToOption.innerHTML = project.getTitle();
        projectInputEdit.append(addListToOption);
      } else {
        console.log('not')
      }

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
    const addButton = document.createElement('button');
    addButton.setAttribute('id', 'openModalBtn');
    addButton.classList.add('new-task');
    addButton.innerText = 'Add new task';
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
      taskElement.dataset.taskId = task.id;
      taskElement.classList.add('task-element');
      taskElement.classList.add(task.priority);
      taskElement.innerHTML = `
      <div class="task-name-description">
      <input type="checkbox" data-task-id = "${task.id}" class="todo-check" ${task.completed ? 'checked' : ''} >
      <label for="${task.task}" class="todo-label">${task.task}</label> 
      <p class="todo-descript">${task.description}</p>
      </div>
      <p>${task.dueDate}</p>
      <p class="priority">${task.listName}</p>
      <button class="edit-task" data-task-id="${task.id}">Edit</button>
      <button class="delete-task" data-task-id="${task.id}">Delete</button>
      `;
      content.append(taskElement);
      // content.append(addButton);
      const taskDescription = taskElement.querySelector('.task-name-description');
      taskDescription.addEventListener('click', (e) => {
        const checkbox = taskElement.querySelector('.todo-check');
        const label = taskElement.querySelector('.todo-label');
        const descript = taskElement.querySelector('.todo-descript');
        const currentTask = getCurrentTask(parseFloat(task.id));
        taskElement.classList.toggle('grayed')
        label.classList.toggle('strike-through');
        descript.classList.toggle('strike-through')
        checkbox.checked = !checkbox.checked;
        currentTask.completed = !currentTask.completed;
        saveToDo(todo)
        console.log(currentTask);
      });
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

  function findProjectByListName(task) {
    return todo.projects.find(project => project.title === task.listName)
  }

  const createNewTask = (e) => {
    e.preventDefault();
    const newDate = format(parseISO(dueDateInput.value), 'MM-dd-yyyy')
    const createTask = new Task(taskNameInput.value, descriptionInput.value, newDate, priorityInput.value, projectInput.value)
    const foundProject = findProject()
    foundProject.addTask(createTask)
    todo.projects[3].tasks = todo.allTasks();
    closeModal();
    taskForm.reset();
    //finds project with selected class, gets the unique id, and renders selected project,
    //if project is already selected when new task is created.
    const selectedProjectId = document.querySelector('.project-name.selected').dataset.listId;
    const currentProject = getCurrentProject(parseFloat(selectedProjectId));
    renderSelectedProject(currentProject);
    saveToDo(todo)
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
    saveToDo(todo)
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
      saveToDo(todo)
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
      // console.log(currentProject)
    } else if (e.target.className === 'delete-task') {
      const selectedTaskId = e.target.dataset.taskId;
      const currentTask = getCurrentTask(parseFloat(selectedTaskId));
      const selectedProjectId = document.querySelector('.project-name.selected').dataset.listId;
      const currentProject = getCurrentProject(parseFloat(selectedProjectId));
      currentProject.deleteTask(findTaskIndex(currentTask));
      for (const project of todo.projects) {
        if (project !== currentProject) {
          const indexToRemove = project.tasks.findIndex(task => task.task === currentTask.task);
          if (indexToRemove !== -1) {
            project.deleteTask(indexToRemove);
          }
        }
      }
      // const indexToRemove3 = todo.projects[3].tasks.findIndex(task => task.task === currentTask.task);
      // const indexToRemove2 = todo.projects[2].tasks.findIndex(task => task.task === currentTask.task);
      // const indexToRemove1 = todo.projects[1].tasks.findIndex(task => task.task === currentTask.task);
      // todo.projects[3].deleteTask(indexToRemove3)
      // todo.projects[2].deleteTask(indexToRemove2)
      // todo.projects[1].deleteTask(indexToRemove1)
      // currentProject.sortByDate();
      // sortThisPriorityHigh(currentProject);
      renderSelectedProject(currentProject);
      saveToDo(todo)
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
    const taskEditTaskList = document.querySelector('#editListSelect')
    const oldProject = findProjectByListName(taskEditData);
    taskEditData.editTask(taskEditTitle.value, taskEditDescription.value, format(parseISO(taskEditDueDate.value), 'MM-dd-yyyy'), taskEditTaskPriority.value, taskEditTaskList.value);
    taskEditProject.deleteTask(findTaskIndex(taskEditData));
    const newProject = findProjectTitle();
    console.log(oldProject)
    oldProject.deleteTask(findTaskIndex(taskEditData))
    newProject.addTask(taskEditData);
    todo.projects[3].tasks = todo.allTasks();
    renderSelectedProject(taskEditProject);
    closeEditTaskModal();
    saveToDo(todo)
    console.log(todo)
  })

  let projectTitleData = null;

  sideBar.addEventListener('click', e => {
    if (e.target.className === 'project-name') {
      let selectedProjectId = e.target.dataset.listId
      const currentProject = getCurrentProject(parseFloat(selectedProjectId));
      console.log(selectedProjectId)
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
      saveToDo(todo)
      renderSelectedProject(todo.projects[0])
      console.log(todo)
    }
  })

  editProjectForm.addEventListener('submit', e => {
    e.preventDefault();
    const projectEditTitle = document.querySelector('#edit-project-title');
    projectTitleData.setTitle(projectEditTitle.value);
    projectTitleData.tasks.forEach(task => task.listName = projectEditTitle.value)
    console.log(todo)
    renderUserCreatedProjects();
    getProjectsForDropdown();
    closeProjectModal();
    saveToDo(todo)
  })

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
    const btns = document.querySelectorAll('.edit');
    const spans = document.querySelectorAll('.close');

    btns.forEach(btn => btn.addEventListener('click', projectModal));
    spans.forEach(span => span.addEventListener('click', closeProjectModal));
  }

  const loadedData = loadToDo();
  console.log(loadedData)
  let todo;
  if (loadedData !== null) {
    todo = new ToDo();

    loadedData.projects.forEach(projectData => {
      const project = new Project(projectData.title);
      projectData.tasks.forEach(taskData => {
        const task = new Task(taskData.task, taskData.description, taskData.dueDate, taskData.priority, projectData.title);
        task.listName = taskData.listName;
        task.completed = taskData.completed;
        task.id = taskData.id;

        project.addTask(task);
      });
      todo.addProject(project);
      renderSelectedProject(todo.projects[0])
    });
  } else {
    todo = new ToDo();
    todo.addProject(new Project('Inbox'));
    todo.addProject(new Project('Today'));
    todo.addProject(new Project('This Week'));
    todo.addProject(new Project('All'));
    renderSelectedProject(todo.projects[0])
  }

  renderUserCreatedProjects();
  renderDefaultProjects();
  getProjectsForDropdown();
  initializeModal();
  initializePModal();
  initializeEditTaskModal();
  renderSelectedProject(todo.projects[0])
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

