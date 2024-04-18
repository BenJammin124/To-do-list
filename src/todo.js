import { isToday, format, parseISO, isThisWeek } from "date-fns";
import { saveToLocalStorage } from "./localStorage";

class ToDo {
  constructor() {
    this.projects = [];
  }

  getProjectTitle() {
    return this.projects.title;
  }

  addProject(project) {
    this.projects.push(project);
  }

  deleteProject(projectIndex) {
    this.projects.splice(projectIndex, 1);
  }

  allTasks() {
    const allTasksArr = [];
    const taskIds = [];
    this.projects.forEach(project => {
      project.tasks.forEach(task => {
        if (!taskIds.includes(task.id)) {
          allTasksArr.push(task);
          taskIds.push(task.id);
        }

      })
    })
    return allTasksArr;
  }

  todayTasks() {
    const todayTasksArr = [];
    const today = format(new Date(), 'MM-dd-yyyy');
    const taskIds = [];
    this.allTasks().forEach(task => {
      const taskDueDate = task.dueDate
      if (today === taskDueDate) {
        if (!taskIds.includes(task.id)) {
          todayTasksArr.push(task);
          taskIds.push(task.id);
        }

      }
    })
    return todayTasksArr;
  }

  thisWeekTasks() {
    const thisWeekArr = [];
    const taskIds = [];
    this.allTasks().forEach(task => {
      const taskDueDate = task.dueDate;
      if (isThisWeek(taskDueDate)) {
        if (!taskIds.includes(task.id)) {
          thisWeekArr.push(task);
          taskIds.push(task.id);
        }
      }
    })
    return thisWeekArr;
  }
}


export default ToDo